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
      res.render('employee/allProduct',{productList:results});
    });
  }else{
    res.redirect('/logout');
  }
});




module.exports = router;
