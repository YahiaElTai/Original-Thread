let express = require('express');
let router = express.Router();
let Shopify = require('shopify-api-node');
const download = require('image-downloader');
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
  const font = 2 * req.body.fontSize;
  const text = req.body.text;
  const textColor = req.body.textColor;
  const textCoordinates = req.body.textCoordinates;
  const textRealXCoord = 100 + 1.75 * textCoordinates.x;
  const textRealYCoord = 100 + 1.75 * textCoordinates.y;
  const projectTitle = req.body.projectTitle;
  const projectDescription = req.body.projectDescription;

  const uploadedImage = 'public/uploads/' + req.body.filename;
  const backgroundImage = req.body.backgroundImage;

  const fileDimensions = req.body.fileDimensions;
  const fileCoordinates = req.body.fileCoordinates;

  const uploadedImageWidth = 2 * fileDimensions.width;
  const uploadedImageHeight = 2 * fileDimensions.height;
  const uploadedImageOffsetX = 291 + 2 * fileCoordinates.x;
  const uploadedImageOffsetY = 291 + 2 * fileCoordinates.y;

  const options = {
    url: backgroundImage,
    dest: 'public/images/backgroundImage.jpg'
  };

  download
    .image(options)
    .then(({ filename, imageFile }) => {
      console.log('File saved to', filename);

      let image = gm('public/images/backgroundImage.jpg');

      if (uploadedImage !== 'public/uploads/null') {
        image = image
          .out(uploadedImage)
          .geometry(`${uploadedImageWidth}x${uploadedImageHeight}+${uploadedImageOffsetX}+${uploadedImageOffsetY}`)
          .out('-composite');
      }
      if (text !== 'Yo Mama So...') {
        image = image
          .fill(textColor)
          .font('../app/fonts/roboto-regular.eot', font)
          .drawText(textRealXCoord, textRealYCoord, text);
      }

      image.write('public/images/new_image.png', function(err) {
        if (err) {
          console.log('image conversion error!');
          console.log('er: ', err);
        } else {
          console.log('image converted success :');
          shopify.product
            .create({
              title: projectTitle,
              body_html: projectDescription,
              vendor: 'Original Thread',
              template_suffix: 'product.liquid',
              images: [
                {
                  attachment: base64_encode('public/images/new_image.png')
                }
              ]
            })
            .then(product => {
              console.log('product created success: ', product);
              res.send(product);
            })
            .catch(err => console.error('shopify create err:', err));
        }
      });
    })

    .catch(err => {
      console.log('download err: ', err);
    });
});

router.route('/update_live_feed').put(function(req, res) {
  const productID = req.body.id;
  shopify.customCollection
    .update(10178953249, {
      collects: [
        {
          product_id: productID,
          position: 1
        }
      ]
    })
    .then(addedProduct => {
      console.log('product added success: ', addedProduct);
    })

    .catch(err => console.error('shopify addding product err:', err));
});

module.exports = router;