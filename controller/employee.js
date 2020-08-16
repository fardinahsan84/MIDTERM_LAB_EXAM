var express = require('express');
var router = express.Router();
var userModel = require.main.require('./models/user-models');
const { check, validationResult } = require('express-validator/check');
var err =
{
	name: "",
	quantity: "",
	price: "",
}

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
		res.render('employee/update',{user : result, err:err});
	});
});

router.post('/update/:id', function(req, res){

  var product ={
    name        :req.body.name,
    quantity 		: req.body.quantity,
    price   	  : req.body.price,
    id          : req.params.id
  }

        	var er = false;
        	if(product.name.length < 1)
        	{
        		//console.log("null");
            		err.name="*required field";
            		er = true;
        	}
        	else
        	{
        		    err.name="";
        	}
        	if(product.quantity < 0 || product.quantity.length < 1)
        	{
            		err.quantity="*required field";
            		er = true;
        	}
        	else
        	{
        		    err.quantity="";
        	}
        	if(product.price < 0 || product.price.length < 1)
        	{
            		err.price="*required field";
            		er = true;
        	}
        	else
        	{
        		    err.price="";
        	}

        	if(!er)
        	{
            userModel.updateProduct(product, function(status){
              if(status){
                res.redirect('/employee/allProduct');

              }else{
                res.redirect('/employee/update/'+req.params.id);
              }
            });
        	}
        	else
        	{
        		    res.redirect('/employee/update/'+req.params.id);
        	}

});

//DELETE
router.get('/delete/:id',function(req,res){
  if(req.session.username== null){
    res.redirect('/logout');
  }
  else{
    userModel.getByIdProduct(req.params.id, function(result){
  		res.render('employee/delete',{user : result});
  	});
  }
});

router.post('/delete/:id',function(req,res){

        if(req.body.choice=="Yes"){
          userModel.deleteProduct(req.body.id, function(status){
            if(status){
              res.redirect('/employee/allProduct');
            }else{
              res.redirect('/employee/delete'+req.body.id);
            }
          });
        }
        else if(req.body.choice=="No"){
          res.redirect('/employee/allProduct');
        }
});




module.exports = router;
