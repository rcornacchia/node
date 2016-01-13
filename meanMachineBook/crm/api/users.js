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

    });
