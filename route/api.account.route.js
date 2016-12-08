(function() { // closure

module.exports = apiAccountRoutes;

function apiAccountRoutes(router, parser, passport, User, Register, McSchema) {
    var api =
        router
            .post('/account/register', parser.json(), register)
            .post('/account/login', parser.json(), login)
            .post('/account/createMc', parser.json(), createMc)
            .get('/account/getMc', getMc);

    return api;

    function register(req, res, next) {
    	console.log("i am inside the server");
    	var email = req.body.register.email;
    	var password = req.body.register.password;
    	var username = req.body.register.username;
        User.checkUserEmailValidate(email, function(err, user){
            if(err) throw err;
            else
                if(user) res.status(202).json({error: "Email has been used"});
                else{
                    User.checkUserNameValidate(username, function(err, user){
                        if(err) throw err;
                        else if(user) res.status(202).json({error: "Username has been used"});
                        else{
                            //Create the newUser
                            console.log(User);
                            var newUser = new User({
                                username: username,
                                password: password,
                                email: email
                            });
                            User.createUser(newUser, function(err, user){
                                if(err) return err;
                                else{
                                    res.status(200).json({success: "Success! Please verify your registration email."})                                    
                                }
                            });                            
                        }
                    });
                  
                }
        });        
    }
    
    function login(req, res, next){
        var username = req.body.login.username;
        var password = req.body.login.password;
        console.log(username);
        console.log(password);

        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                console.log("no user");
                res.status(400).send("username or password incorrrect1");
            } else{
                User.comparePassword(password, user.password, function(err, isMatch){
                    if(err) console.error(err);
                    if(isMatch){
                        res.status(200).json(user);
                    } else {
                        res.status(400).send("username or password incorrrect2");
                    }
                });  
              }             
        });
    }

    function createMc(req, res, next){
        var data = req.body.mc;
        console.log(data);

        var newmc = new McSchema(data);
        newmc.save(function(err, mc){
            if(err) throw err;
            else
                res.status(200).json(mc);
        });
    }

    function getMc(req, res, next){
        McSchema.find(function(err, mcs){
            if(err) throw err;
            else{
                console.log("@@@@@@@@@@@@@");
                console.log(mcs);
                res.status(200).json(mcs);
            }
        });
    }
}

})(); // closure