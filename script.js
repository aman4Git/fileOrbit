const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/database');
connectDB();

//Function to delete files after 24 hours
async function deleteFileAfter24Hours() {

    //Get past date
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    //Get all files that are expired
    const files = await File.find({ createdAt: { $lt: pastDate } });

    //Delete all files that are expired from uploads folder and remove them from database
    if (files.length) {
        for (const file of files) {
            try {

                //Delete file from uploads folder
                fs.unlinkSync(file.path);

                //Delete file from database
                await File.deleteOne({ _id: file._id });

                console.log(`File ${file.filename} has been deleted successfully.`);

            } catch (error) {
                console.log(`Error while deleting file ${error}`);
            }
        }

        console.log('Job completed!');

    }

}

deleteFileAfter24Hours().then(process.exit)