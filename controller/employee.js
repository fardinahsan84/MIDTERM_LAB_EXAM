var express = require('express');
var router = express.Router();
var userModel = require.main.require('./models/user-models');
const { check, validationResult } = require('express-validator/check');


router.get('/',function(req,res){
  if(req.session.username== null){
    res.redirect('/logout');
  }else{
    userModel.getUserByUsername(req.session.username,function(result){

  		res.render('employee/index', { user : result[0], username: req.session.username});
  	});
  }
});

router.post('/',function(req,res){
  if(req.body.choice=="Add new Product"){
    res.redirect('/employee/addProduct');
  }
  else if(req.body.choice=="All Products"){
    res.redirect('/employee/allProduct');
  }
});


router.get('/addProduct',function(req,res){

  if(req.session.username !=null){
    res.render('employee/addProduct');
  }else{
    res.redirect('/logout');
  }
});

router.post('/addProduct',function(req,res){

  if(req.session.username !=null){
    var product ={
      name        : req.body.name,
      quantity 		: req.body.quantity,
      price   	: req.body.price
    }

    userModel.insertProduct(product, function(status){
      if(status){
        res.redirect('/employee/allProduct');
      }else{
        res.redirect('/employee/addProduct');
      }
    });
  }else{
    res.redirect('/logout');
  }
});

router.get('/allProduct',function(req,res){

  if(req.session.username !=null){
    userModel.getAllProduct(function(results){
      res.render('employee/allProduct', {productList:results});
    });
  }else{
    res.redirect('/logout');
  }
});


router.get('/update/:id', function(req, res){

	userModel.getByIdProduct(req.params.id, function(result){
		res.render('employee/update',{user : result});
	});
});

router.post('/update/:id', function(req, res){

  var product ={
    quantity 		: req.body.quantity,
    price   	: req.body.price,
    id        : req.params.id
  }

	userModel.updateProduct(product, function(status){
		if(status){
			res.redirect('/employee/allProduct');

		}else{
			res.redirect('/employee/update/'+req.params.id);
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
