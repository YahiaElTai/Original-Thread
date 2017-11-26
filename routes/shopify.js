let express = require('express');
let router = express.Router();
let Shopify = require('shopify-api-node');
const download = require('image-downloader');
var request = require('request');
let fs = require('fs');
let gm = require('gm').subClass({ imageMagick: true });


// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  let bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

// Environment and variables
const NODE_ENV = process.env.NODE_ENV || 'development';
let ENV_CONFIG = require('.././config/' + NODE_ENV + '.config');
require('dotenv').config();

// Establish connection with Shopify
const shopify = new Shopify({
  shopName: ENV_CONFIG.SHOPIFY_SHOP,
  apiKey: 'bb608ca7d982da725e47721434d42612',
  password: 'bb8b59d2e3a94c825604a9ce0abc069f'
});

// Index route for Shopify
router.route('/').get(function(req, res) {
  console.log('getting data from Shopify...');
  shopify.product
    .list({ limit: 5 })
    .then(orders => console.log(orders))
    .catch(err => console.error(err));
});

// Create new product image
router.route('/new_product_image').post(function(req, res) {
  const projectTitle = req.body.projectTitle;
  const projectDescription = req.body.projectDescription;

  console.log('projectTitle: ', projectTitle);
  console.log('projectDescription: ', projectDescription);
  const uploadedImage = 'public/uploads/' + req.body.filename;
  const backgroundImage = req.body.backgroundImage;
  console.log('backgroundImage: ', backgroundImage);

  const fileDimensions = req.body.fileDimensions;
  const fileCoordinates = req.body.fileCoordinates;

  console.log('fileDimensions: ', fileDimensions);
  console.log('fileCoordinates: ', fileCoordinates);
  console.log('req.body.filename: ', req.body.filename);

  const uploadedImageWidth = fileDimensions.width;
  const uploadedImageHeight = fileDimensions.height;
  const uploadedImageOffsetX = 155 + fileCoordinates.x;
  const uploadedImageOffsetY = 110 + fileCoordinates.y;



   const options = {
     url: backgroundImage,
     dest: 'public/images/backgroundImage.jpg'
   }

   download.image(options)
     .then(({ filename, image }) => {
       console.log('File saved to', filename);

       gm("public/images/backgroundImage.jpg")
         .composite(uploadedImage)
         .geometry(`${uploadedImageWidth}x${uploadedImageHeight}+${uploadedImageOffsetX}+${uploadedImageOffsetY}`)
         .write("public/images/new_image.png" , function(err) {
           if (err) {
             console.log('image conversion error!');
             console.log('er: ', err);
           } else {
             console.log('image converted success :');


             shopify.product.create({
                                 "title": projectTitle,
                                 "body_html": projectDescription,
                                 "vendor": "Original Thread",
                                 "template_suffix": "product.liquid",
                                 "images": [
                                       {
                                         "attachment": base64_encode("public/images/new_image.png")
                                       }
                                       ]
                               })
                               .then(product => {
                                console.log('product created success: ', product)
                                res.send(product);
                                })

                               .catch(err => console.error('shopify create err:', err));
           }
         });

     }).catch((err) => {
       console.log("download err: ", err);
     })





});


  router.route('/update_live_feed').put(function(req, res) {

    const productID = req.body.id;
    console.log("newProduct: ", productID);


    shopify.customCollection.update(10178953249, {
                                                  "collects": [
                                                    {
                                                      "product_id": productID,
                                                      "position": 1
                                                    }
                                                  ]
                                                  })
                                .then(addedProduct => {
                                console.log('product added success: ', addedProduct)
                                })

                               .catch(err => console.error('shopify addding product err:', err));


  })

module.exports = router;