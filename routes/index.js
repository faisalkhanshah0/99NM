var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express' });
});
router.get('/privacy-policy', function(req, res, next) {
  res.render('privacy-policy', { title: 'Express' });
});
router.get('/refund-policy', function(req, res, next) {
  res.render('refund-policy', { title: 'Express' });
});
router.get('/terms-of-use', function(req, res, next) {
  res.render('termsofuse', { title: 'Express' });
});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Express' });
});
router.get('/disclaimer', function(req, res, next) {
  res.render('disclaimer', { title: 'Express' });
});
router.get('/post-an-ad', function(req, res, next) {
  res.render('post-an-ad', { title: 'Express' });
});
router.get('/business-categories', function(req, res, next) {
  res.render('categories', { title: 'Express' });
});
router.get('/articles', function(req, res, next) {
  res.render('articles-listing', { title: 'Express' });
});
router.get('/:keyword', function(req, res, next) {
  res.render('business-listing', { title: 'Express' });
});
router.get('/article/:title', function(req, res, next) {
  res.render('article', { title: 'Express' });
});
router.get('/:city/:area/:title/:id', function(req, res, next) {
  console.log(req.params);
  res.render('detail-page', { title: 'Express' });
});
router.get('*', function(req, res, next) {
  res.render('404', { title: '404 Page not Found !' });
});
module.exports = router;
