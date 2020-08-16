var express = require('express');
var db 		= require.main.require('./models/db');
const { check, validationResult } = require('express-validator');
var userModel = require.main.require('./models/user-models');
var router 	= express.Router();
var err="";


router.get('/',[check('username','username is required').isEmpty(),
                check('password','Password is requi').isEmpty()] ,
                function(req,res){
                    var errors = validationResult(req);
                    res.render('login/index',{error:errors.mapped()});
});

router.post('/',[
  check('username', 'username is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()],
  function(req, res){

		var user ={
			username: req.body.username,
			password: req.body.password
		};

var errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors.mapped());
      err="username/password cannot be empty"
    	res.render('login/index',{error:errors.mapped()});
		}
		else{

          userModel.validate(user, function(status){
            if(status){
              userModel.getUserByUsername(req.body.username,function(results)
              {
                req.session.username = user.username;
                    if (results[0].userType=="admin")
                    {
                      res.redirect('/admin');
                    }
                    else if (results[0].userType=="employee")
                    {
                      res.redirect('/employee');
                    }
              });
            }
            else{
              err="invalid username/password"
              res.redirect('/login');
            }
          });
	}
});



module.exports = router;
