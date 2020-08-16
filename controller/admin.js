var express = require('express');
var router = express.Router();
var db 		= require.main.require('./models/db');
var userModel = require.main.require('./models/user-models');
const { check, validationResult } = require('express-validator/check');

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

	userModel.getAllEmployee("employee",function(results){
    console.log(results);
		res.render('admin/AllEmployee', { userList : results, username: req.session.username});
	});
});

router.post('/AllEmployeeList', function(req, res){
	var search = req.body.search;
	if(search == ""){
		res.redirect('/admin/AllEmployeeList');
	}
	else{
				userModel.getSearchByID(search,"employee", function(results){
          if(results.length > 0){
				       res.render('admin/search',{userList: results});
            }else{
               console.log('Search not found');
            }
			});
		}


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

router.get('/update/:id', function(req, res){

	userModel.getById(req.params.id, function(result){
		res.render('admin/update',{user : result});
	});
});

router.post('/update/:id', function(req, res){

	var user = {
    username: req.body.username,
		password: req.body.password,
    phone: req.body.phone,
    address:req.body.address,
		id: req.params.id
	};

	userModel.update(user, function(status){
		if(status){
			res.redirect('/admin/AllEmployeeList');

		}else{
			res.redirect('/admin/update/'+req.params.id);
		}
	});
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

module.exports = router;
