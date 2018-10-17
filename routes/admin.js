var express = require('express');
var router = express.Router();
var axios = require('axios');
var adminuser;
var checkSignIn = function(req, res, next){
  if(req.session.adminuser){
    adminuser = req.session.adminuser;
    next();     //If session exists, proceed to page
  } else {
    res.redirect(301, process.env.BASEURL+'/admin/login');
  }
}
// admin Login
router.get('/login', function(req, res, next) {
// res.json({status:'admin'});
let login = 1;
res.render('admin/login', {login, title:'Admin Login'});
  
});
//Dashboard
router.get('/dashboard',  checkSignIn, function(req, res, next) {
  // res.json({status:'admin'});
  // let adminuser = req.session.adminuser;
  res.render('admin/dashboard', {title:'Admin Dashboard', adminuser});
    
});
//Listings
router.get('/listings',  checkSignIn, function(req, res, next) {
  let uri = `${process.env.BASEURL}/api/admin/getadsqueue`
  axios.get(uri)
    .then(function (response) {
          let businessdetail = response.data.result;
          let data = [];
          businessdetail.forEach(element => {
            let obj = {
              cid: element.cid,
              value: JSON.stringify(element, undefined, 2)
            }
            data.push(obj);
          });

          res.render('admin/listings', {title:'Admin Dashboard', adminuser, data});
    })
    .catch(function (error) {
      res.redirect(process.env.BASEURL+'/admin/dashboard');
    });

    
});
//Queries
router.get('/queries',  checkSignIn, function(req, res, next) {
  // res.json({status:'admin'});
  // let adminuser = req.session.adminuser;
  res.render('admin/queries', {title:'Admin Dashboard', adminuser});
    
});
//Client Queries
router.get('/clientqueries',  checkSignIn, function(req, res, next) {
  // res.json({status:'admin'});
  // let adminuser = req.session.adminuser;
  res.render('admin/clientqueries', {title:'Admin Dashboard', adminuser});
    
});
//Add Article
router.get('/addarticle',  checkSignIn, function(req, res, next) {
  // res.json({status:'admin'});
  // let adminuser = req.session.adminuser;
  res.render('admin/addarticle', {title:'Admin Dashboard', adminuser});
    
});
//Upload Image
router.get('/uploadimage',  checkSignIn, function(req, res, next) {
  // res.json({status:'admin'});
  // let adminuser = req.session.adminuser;
  res.render('admin/uploadimage', {title:'Admin Dashboard', adminuser});
    
});
//logout
router.get('/logout', function(req, res, next) {    
 req.session.destroy(function(){
    console.log("Adminuser logged out.")
 });
// console.log('loged out user : '+req.session.adminuser);
  res.redirect(301, process.env.BASEURL+'/admin/login');

});  
module.exports = router;
