// Base Setup


// Call the Packages
var express     = require('express');       // call express
var app         = express();                // define our app using express
var bodyParser  = require('body-parser');   // get body parser
var morgan      = require('morgan');        // used to see requests
var mongoose    = require('mongoose');      // communicates w database
var port        = process.env.PORT||8080;   // set the port

// App Configuration
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// Routes for API
// basic route for home Packages
app.get('/', function(req, res) {
    res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// test route to make sure everything is owkring
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to api' });
});

// more routes go here

// Register our Routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);

// Start the Server
app.listen(port);
console.log('Magic happens on port ' + port);
