var express = require('express');
var router = express.Router();
var db 		= require.main.require('./models/db');
var userModel = require.main.require('./models/user-models');
const { check, validationResult } = require('express-validator');
const { matchedData, sanitizeBody } = require('express-validator/filter');

router.get('/',function(req,res){
  if(req.session.username== null){
    res.redirect('/logout');
  }
  else{
    var sql = "select * from users where username='"+req.session.username+"'";
    db.getResults(sql,function(results){

      res.render('admin/index',{userlist: results[0], name : req.session.username});
    });
  }
});

router.post('/',function(req,res){
  if(req.body.choice=="AddEmployee"){
    res.redirect('/admin/AddEmployee');
  }
  else if(req.body.choice=="AllEmployeeList"){
    res.redirect('/admin/AllEmployeeList');
  }
  else if(req.body.choice=="Logout"){
    req.session.username=null;
    res.redirect('/logout');
  }
});

//AllEmployeeList
router.get('/AllEmployeeList', function(req, res){
  var data = {
        username: req.session.username
    }
    userModel.getAllEmployee("employee",function (result) {
        data['userList'] = result;
        //console.log();
        res.render('admin/AllEmployee', data);
    });
});

router.post('/AllEmployeeList', function(req, res){
  console.log(req.body);
  userModel.search(req.body.key,"employee", (result) => {
      console.log('inside post');
      console.log(result);
      res.json({
          userList: result
      })
  });
});


//AddEmployee
router.get('/AddEmployee',function(req,res){
  if(req.session.username !=null){
    res.render('admin/AddEmployee');
  }else{
    res.redirect('/logout');
  }
});

router.post('/AddEmployee',function(req,res){
  if(req.session.username != null){

      		var user ={
            name        : req.body.name,
      			username 		: req.body.username,
      			password   	: req.body.password,
            phone       : req.body.phone,
      			userType	  : "employee"
      		}

      		userModel.insert(user, function(status){
      			if(status){
      				res.redirect('/admin/AllEmployeeList');
      			}else{
      				res.redirect('/admin/AddEmployee');
      			}
      		});
	}else{
		res.redirect('/logout');
	}
});

//update

router.get('/update/:id',[
                check('username','*username is required').isEmpty(),
                check('password','*Password is required').isEmpty(),
                check('phone','* Phone is required').isEmpty()
                ] ,
                function(req,res){
                    var errors = validationResult(req);

                    if (!errors.isEmpty()) {
                          //console.log(errors.mapped());
                          userModel.getById(req.params.id, function(result){
                            res.render('admin/update',{user : result,error:errors.mapped()});
                          });
                    }
                    else{
                      //console.log(errors.mapped());
                    	userModel.getById(req.params.id, function(result){
                    		res.render('admin/update',{user : result,error:errors.mapped()});
                    	});
                    }
});

router.post('/update/:id',[
                check('username','* username is required').notEmpty(),
                check('password','* Password is required')
                      .notEmpty()
                      .isLength({min:8})
                      .withMessage('Password must be at least 8 char long'),
                check('phone','* Phone number is required')
                      .notEmpty()
                      .isLength({min:11, max:11})
                      .withMessage('phone number must be exactly 11 char long')
                ] ,
                function(req,res){
                  /*var user = {
                    username: req.body.username,
                    password: req.body.password,
                    phone: req.body.phone,
                    id: req.params.id
                  }*/
                    var errors = validationResult(req);
                      if (!errors.isEmpty()){

                      			console.log(errors.mapped());
                            userModel.getById(req.params.id, function(result){
                              res.render('admin/update',{user : result,error:errors.mapped()});
                            });
                  		}
                  		else{

                        const users= matchedData(req);
                        console.log(users);

                        	userModel.update(users,req.params.id, function(status){
                        		if(status){
                        			res.redirect('/admin/AllEmployeeList');

                        		}else{
                        			res.redirect('/admin/update/'+req.params.id);
                        		}
                        	});
                    }
});

//DELETE
router.get('/delete/:id',function(req,res){
  if(req.session.username== null){
    res.redirect('/logout');
  }
  else{
    userModel.getById(req.params.id, function(result){
  		res.render('admin/delete',{user : result});
  	});
  }
});

router.post('/delete/:id',function(req,res){

        if(req.body.choice=="Yes"){
          userModel.delete(req.body.id, function(status){
            if(status){
              res.redirect('/admin/AllEmployeeList');
            }else{
              res.redirect('/admin/delete'+req.body.id);
            }
          });
        }
        else if(req.body.choice=="No"){
          res.redirect('/admin/AllEmployeeList');
        }
});

router.post('/search', function (req, res) {
    console.log(req.body);
    userModel.search(req.body.key,"employee", (result) => {
        console.log(result);
        res.json({
            userList: result
        })
    });
});
module.exports = router;
