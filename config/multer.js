const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'marketplace-listings',
        allowedFormats: ['jpg', 'jpeg', 'png'],
        resource_type: 'image'
    }
})

module.exports = multer({
    storage: storage
})