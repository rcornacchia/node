// Base Setup


// Call the Packages
var express     = require('express');       // call express
var app         = express();                // define our app using express
var bodyParser  = require('body-parser');   // get body parser
var morgan      = require('morgan');        // used to see requests
var mongoose    = require('mongoose');      // communicates w database
mongoose.connect('mongodb://localhost/test');
var port        = process.env.PORT||8080;   // set the port
var User        = require('./app/models/user');

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

apiRouter.use(function(req, res, next) {
    // do logging
    console.log('Somebody just came to our app!');
    // we'll add more to the middleware in Chapter 10
    // this is where we will authenticate users

    next(); // make sure we go to the next routek
});

// test route to make sure everything is owkring
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to api' });
});

// ROUTES FOR OUR API
// route middleware and first route
// on routes that end in /users
apiRouter.route('/users')

    // create a user
    // accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
        // create a new instance of the User models
        var user = new User();

        // set the users information (comes from request)
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        // save the user and check for errors
        user.save(function(err) {
            if(err) {
                // duplication entry
                if (err.code == 11000) {
                    return res.json({
                        success: false,
                        message: "A user with that username already exits."
                    });
                } else {
                    return res.send(err);
                }
            }
            res.json({ message: "User created!"});
        });

    }).get(function(req, res) {
        User.find(function(err, users) {
            if(err) res.send(err);
            
            // return the users
            res.json(users);
        });
    });


// more routes go here

// Register our Routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);

// Start the Server
app.listen(port);
console.log('Magic happens on port ' + port);
