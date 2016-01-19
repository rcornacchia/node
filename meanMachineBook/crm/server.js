// Call the Packages
var express     = require('express');       // call express
var app         = express();                // define our app using express
var bodyParser  = require('body-parser');   // get body parser
var morgan      = require('morgan');        // used to see requests
var port        = process.env.PORT||8080;   // set the port
var User        = require('./app/models/user');
var jwt         = require('jsonwebtoken');
var superSecret = "ilovescotchscotchyscotchscotch";
var mongoose    = require('mongoose');      // communicates w database
mongoose.connect('mongodb://localhost/test');


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

// route for authenticating users (POST http://localhost:808/api/authenticate)
apiRouter.post('/authenticate', function (req, res) {
    // find the user
    // select the name username and password explicitly
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function(err, user) {
        if (err) throw err;

        // no user with that username was found
        if(!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            // check if password matches
            var validPassword = user.comparePassword(req.body.password);
            if(!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                }, superSecret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as json
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

apiRouter.use(function(req, res, next) {
    // do logging
    console.log('Somebody just came to our app!');

    // check header or url parameters or post parameter for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks expiration
        jwt.verify(token, superSecret, function(err, decoded) {
            if(err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everthing is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an HTTP response of 403 (access forbidden) and an error message)
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
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


    apiRouter.route('/users/:user_id')
        // get the user with that id
        // accessed at GET http://localhost:8080/api/users/:user_id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })
        .put(function(req, res) {

            // use our user model to find the user we want
            User.findById(req.params.user_id, function(err, user) {
                if(err) res.send(err);

                // update the users info only if ts new
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;

                // save the user
                user.save(function(err) {
                    if(err) res.send(err);

                    // return a message
                    res.json({ message: 'User updated!' });
                });
            });
        }).delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if(err) return res.send(err);
                res.json({ message: 'Successfully deleted' });
            });
        });

apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
});

// more routes go here

// Register our Routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);

// Start the Server
app.listen(port);
console.log('Magic happens on port ' + port);
