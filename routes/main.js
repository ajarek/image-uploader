const router = require('express').Router()
const store = require('../middleware/multer')
const Upload = require('../models/Upload')
const fs = require('fs')
const {
  error
} = require('console')


router.get('/', async(req, res) => {
  const allImages = await Upload.find()
  
  res.render('main',{images:allImages})
})
router.post('/uploadmultiple', store.array('images', 12), (req, res, next) => {
  const files = req.files;

  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error)
  }

  // convert images into base64 encoding
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path)

    return encode_image = img.toString('base64')
  })

  let result = imgArray.map((src, index) => {

    // create object to store data in the collection
    let finalImg = {
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src
    }

    let newUpload = new Upload(finalImg);

    return newUpload
      .save()
      .then(() => {
        return {
          msg: `${files[index].originalname} Uploaded Successfully...!`
        }
      })
      .catch(error => {
        if (error) {
          if (error.name === 'MongoError' && error.code === 11000) {
            return Promise.reject({
              error: `Duplicate ${files[index].originalname}. File Already exists! `
            });
          }
          return Promise.reject({
            error: error.message || `Cannot Upload ${files[index].originalname} Something Missing!`
          })
        }
      })
  });

  Promise.all(result)
    .then(msg => {
      // res.json(msg);
      res.redirect('/')
    })
    .catch(err => {
      res.json(err);
    })
})
module.exports = router