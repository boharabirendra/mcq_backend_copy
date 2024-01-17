const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { resourceLimits } = require('worker_threads');


require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            resource_type: 'auto'
        }, (error, result) => {
            if (error) {
                reject(new Error('Cloudinary upload error'));
            } else {
                resolve(result);
            }
        }).end(fileBuffer);
    });
};

module.exports = {
    uploadOnCloudinary
};
