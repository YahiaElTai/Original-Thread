let express = require('express');
let router = express.Router();
let Shopify = require('shopify-api-node');


// Environment and variables
const NODE_ENV = (process.env.NODE_ENV || 'development');
let ENV_CONFIG = require('.././config/' + NODE_ENV + '.config');
require('dotenv').config();

// Establish connection with Shopify
const shopify = new Shopify({
  shopName: ENV_CONFIG.SHOPIFY_SHOP,
  apiKey: 'bb608ca7d982da725e47721434d42612',
  password: 'bb8b59d2e3a94c825604a9ce0abc069f'
});


// Get news post item
router.route('/get-news-item')
  .get(function (req, res) {
    shopify.article.get(req.query.blog_id, req.query.post_id)
    .then((newsItem) => {
      res.status(200).send(newsItem);
    })
    .catch(err => console.error(err));
  });

// Get page content
router.route('/get-pages')
  .get(function (req, res) {
    shopify.page.list()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => console.error(err));
  });


module.exports = router;
