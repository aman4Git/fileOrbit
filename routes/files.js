require("dotenv").config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');
const sendMail = require('../services/emailService');

//Multer configurations
let storage = multer.diskStorage({

    //Destination of the file where the file is going to be stored
    destination: (req, file, cb) => cb(null, 'uploads/'),

    //Name of the file
    filename   : (req, file, cb) => {

        //Generate a unique name for the file
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        //Return the name of the file
        cb(null, uniqueName);
    }

});

//File upload configuration
let upload = multer({
    storage: storage,
    limit: {fileSize: 1000000 * 100}
}).single('file');

//Upload files in upload folder and store data in the database.
router.post('/', (req, res) => {

    //Store file
    upload(req, res, async (err) => {

        //validate request
        if(!req.file){

            //Return response
            return res.json({errors: "All fields are required" });
        }

        //Check if have any errors
        if(err){

        //Return response
        return res.status(500).send({errors: err.message });
        }

        //Store file data to the database
        const file = new File({

            filename: req.file.filename,
            uuid    : uuid4(),
            path    : req.file.path,
            size    : req.file.size,
        })

        //Save file to the database
        const response = await file.save();

        //Return response with download URL
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});

    });

})

router.post('/send', async (req, res) => {

    //Validate request
    const { uuid, emailTo, emailFrom } = req.body;

    //if uuid, emailTo and emailFrom is empty
    if(!uuid ||!emailTo ||!emailFrom){
        return res.status(422).send({error: 'All fields are required'});
    }

    //Get data from the database
    const file = await File.findOne({uuid: uuid});

    //Check if file exists do not sent the mail
    if(file.sender){
        return res.status(422).send({error: 'Email already sent.'});
    }

    //If email is not sent already update sender and receiver
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //send the mail
    sendMail({
        from   : emailFrom,
        to     : emailTo,
        subject: 'You have received a file from FileOrbit',
        text   : `${emailFrom} shared a file with you.`,
        html   : require('../services/emailTemplate')({
            emailFrom   : emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size        : parseInt(file.size/1000) + 'KB',
            expires     : '24 hours',
        }),
    });

    //Return response
    return res.send({success: true});

});

module.exports = router;