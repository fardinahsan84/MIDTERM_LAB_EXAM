var express = require('express');
var router = express.Router();
var err="";
router.get('/', function(req, res){
	req.session.username = null;

	res.redirect('/login');
});

module.exports = router;
