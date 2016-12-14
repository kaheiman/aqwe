(function() { // closure

module.exports = apiAccountRoutes;
var data = '';
var readableStream = "";




function apiAccountRoutes(router, parser, passport, User, Register, McSchema, ObjectId, json2csv, fs) {
    var api =
        router
            .post('/account/register', parser.json(), register)
            .post('/account/login', parser.json(), login)
            .post('/account/createMc', parser.json(), createMc)
            .get('/account/getMc', getMc)
            .post('/account/search', parser.json(), search)
            .post('/account/getMymc', parser.json(), getMymc)
            .post('/account/resave', parser.json(), resave)
            .post('/account/formCsv', parser.json(), formCsv)
            .post('/account/downLoadFile', parser.json(), downLoadFile)
            .get('/account/getUserInfo', getUserInfo)
            .get('/account/logout', logout);
  
    return api;

    function checkAuth(req, res, next){
        console.log("checking is allowed");
        next();
    }

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
                        //DO AUTH HERE PASS SESSION
                        console.log("take id: ", user._id);
                        req.session.key = user._id;
                        res.cookie('jwt_login', "true", { maxAge: 900000, httpOnly: true});
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
        McSchema.find({launched: true},  null, {sort: '-lastUpdated'}, function(err, mcs){
            if(err) throw err;
            else{
                res.status(200).json(mcs);
            }
        }).sort;
    }

    function search(req, res, next){
        console.log(req.body.data);
        var data = req.body.data;
        var condition = {launched: true};
        if(data.type == "tag"){
            if(data.tags != null && data.tags != "" && data.tags.length > 0)
                condition = {$and: [{tags: {$all: data.tags}}, {launched: true}]}
            console.log(condition);
            McSchema.find(condition, function(err, mcs){
                if(err) throw err;
                else{
                    res.status(200).json(mcs);
                }
            });
        } 
        else if(data.type == "name"){
            if(data.owner != null && data.owner.length > 0)
                condition = {$and: [{ownername: data.owner}, {launched: true}]};
            console.log("condition: ", condition);
            McSchema.find(condition, function(err, mcs){
                if(err) throw err;
                else{
                    res.status(200).json(mcs);
                }
            });            
        }

    }

    function getMymc(req, res, next){
        console.log(req.body.id);
        McSchema.find({creator: new ObjectId(req.body.id)}, function(err, mcs){
            if(err) throw err;
            else
                res.status(200).json(mcs);
        });
    }

    function resave(req, res, next){
        var newmc = req.body.data;
        if(!req.body.delete){
            McSchema.findOne({_id: newmc._id}, function(err, mc){
                if(err) throw err;
                else{
                    // mc = req.body.data;
                    console.log("#########################");
                    console.log(mc);
                    mc.description = newmc.description;
                    mc.launched = newmc.launched;
                    mc.choiceD = newmc.choiceD;
                    mc.choiceC = newmc.choiceC;
                    mc.choiceB = newmc.choiceB;
                    mc.choiceA = newmc.choiceA;
                    mc.question = newmc.question;
                    mc.title = newmc.title;
                    mc.lastUpdated = new Date().getTime();
                    mc.save(function(err, mc){
                        if (err) throw err;
                        else
                            res.status(200).json(mc);
                    });
                }
            });  
        } else{
            McSchema.findOne({_id: req.body.data[0]._id}, function(err, mc){
                if(err) throw err;
                else{
                    console.log(mc)
                    mc.remove(function(err, mc){
                        if (err) throw err;
                        else
                            res.status(200).json(mc);
                    });
                }
            });              
        }

    }
    function downLoadFile(req, res, next){
        var array = [];
        console.log("hello world");
        var mcs = req.body.data;
        for(var i = 0; i < mcs.length; i++){
            var object = {
                "Question" : mcs[i].question,
                "choiceA": mcs[i].choiceA,
                "choiceB": mcs[i].choiceB,
                "choiceC": mcs[i].choiceC,
                "choiceD": mcs[i].choiceD,
                "Answer": mcs[i].ans,
                "Explain" : mcs[i].explain
            }
            array.push(object);
        }
        var fields = ['Question', 'choiceA', 'choiceB', 'choiceC', 'choiceD', 'Answer', 'Explain'];
        var csv = json2csv({ data: array, fields: fields });
        fs.writeFile('./route/mcfile.csv', csv, function(err) {
          if (err) throw err;
          console.log('file saved');
          res.attachment('mcfile.csv');
          res.status(200).send(csv);          
          // readableStream = fs.createReadStream('mcfile.csv');
          // console.log(data);
            // readableStream.on('data', function(chunk){
            //     console.log("@@@@@@@@@@@@@@@@@@@@");
            //     data += chunk;
            // });
            // readableStream.on('end', function(){
            //     console.log("end");
            //     res.send(new Buffer(data));
            // });            
        });
    }      

    function getUserInfo(req, res, next){
        console.log("get user info @@@@@@@@@@@@@@@@@@@@@@@@");
        if(req.session.key){
            User.findOne({'_id': req.session.key}, function(err, user){
                if(err) throw err;
                else
                    res.status(200).json(user);
            });            
        }

    }

    function logout(req, res, next){
        console.log("i am log out");
        req.session.destroy(function(err){
            console.log("##################");
            if(err) throw err;
            res.send(200);            
        });
    }

    function formCsv(req, res, next){
        console.log("inside the formCsv");
        var fields = ['car', 'price', 'color'];
        var myCars = [
          {
            "car": "Audi",
            "price": 40000,
            "color": "blue"
          }, {
            "car": "BMW",
            "price": 35000,
            "color": "black"
          }, {
            "car": "Porsche",
            "price": 60000,
            "color": "green"
          }
        ];
        var csv = json2csv({ data: myCars, fields: fields });
         
        fs.writeFile('file2.csv', csv, function(err) {
          if (err) throw err;
          console.log('file saved');
          res.attachment('file.csv');
          res.status(200).send(csv);
        });
    }
}

})(); // closure