let express = require('express');
let app = express();
let logger = require('morgan');
let cors = require('cors');
let bodyParser = require('body-parser');
let shopify = require('./routes/shopify.js');
let upload = require('./routes/upload.js');
require('dotenv').config();

// Set port
app.set('port', process.env.PORT || 5000);

// Set static folder
app.use(express.static(__dirname + '/public'));

// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

app.use(bodyParser.json());

// Shopify routes
app.use('/shopify', shopify);

// Upload routes
app.use('/upload', upload);

// Serve the index file
app.get('*', function(request, response) {
	response.sendFile(__dirname + '/public/index.html');
});

// Listen to port
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
