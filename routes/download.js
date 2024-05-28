const express = require('express');
const router = express.Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {

    //Get file by uuid
    const file = await File.findOne({uuid: req.params.uuid});
        
    //Check if file exists
    if(!file){
        return res.render('download', {error: 'Link has been expired.'});
    }

    //Get file path
    const filePath = `${__dirname}/../${file.path}`;

    //Download file
    res.download(filePath);

});

module.exports = router;