let express = require('express');
let router = express.Router();
let Shopify = require('shopify-api-node');
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
//
// Create new product
// router.route('/new_product').post(function(req, res) {
//   shopify.product
//     .create({
//       title: 'test prod1'
//     })
//     .then(product => {
//       console.log('product created: ', product);
//       res.send({ product });
//     })
//     .catch(err => console.error(err));
// });

// Create new product image
router.route('/new_product_image').post(function(req, res) {
  const uploadedImage = 'public/uploads/' + req.body.filename;
  const backgroundImage = 'public/images/' + req.body.backgroundImage;

  const fileDimensions = req.body.fileDimensions;
  const fileCoordinates = req.body.fileCoordinates;

  console.log('fileDimensions: ', fileDimensions);
  console.log('fileCoordinates: ', fileCoordinates);

  const uploadedImageWidth = fileDimensions.width;
  const uploadedImageHeight = fileDimensions.height;
  const uploadedImageOffsetX = 155 + fileCoordinates.x;
  const uploadedImageOffsetY = 110 + fileCoordinates.y;

  gm(backgroundImage)
    .composite(uploadedImage)
    .geometry(`${uploadedImageWidth}x${uploadedImageHeight}+${uploadedImageOffsetX}+${uploadedImageOffsetY}`)
    .write('public/images/new_image.png', function(err) {
      if (err) {
        console.log('image conversion error!');
        console.log('er: ', err);
      } else {
        console.log('image converted success :');
      }
    });

  shopify.productImage
    .create(220552200225, {
      attachment: base64_encode('public/images/new_image.png'),
      filename: req.body.filename
    })
    .then(productImage => console.log('product image created: ', productImage))
    .catch(err => console.error('shopify create err:', err));

  res.send('hello world');
});

module.exports = router;

// var config = {
//   rate_limit_delay: 10000,
//   backoff: 35,
//   backoff_delay: 1000
// };
//
// var url = shopify.buildAuthURL();

// app.get('/finish_auth', function(req, res) {
//   var Shopify = new shopifyAPI(config), // You need to pass in your config here
//     query_params = req.query;
//   Shopify.exchange_temporary_token(query_params, function(err, data) {});
// });
//
// function callback(err, data, headers) {
//   var api_limit = headers['http_x_shopify_shop_api_call_limit'];
//   console.log(api_limit); // "1/40"
// }
//
// shopifyAPI.prototype.exchange_temporary_token = function(query_params, callback) {
//   if (!self.is_valid_signature(query_params)) {
//     return callback(new Error("Signature is not authentic!"));
//   }
// }
//
// app.post('/new_product', function(req, res) {
//   data = {
//     product: {
//       title: req.body.title,
//       body_html: req.body.body_html,
//       images: [
//         {
//           src: req.body.image_src
//         }
//       ],
//       vendor: "Vendor",
//       product_type: "Type"
//     }
//   }
//
//   shopify.post('/admin/products.json', data, function(err, resp, headers) {
//     if (err)
//       return next(error);
//     return res.json(resp);
//   });
// });
//
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }
//
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });
