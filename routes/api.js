var express = require('express');
var router = express.Router();

const { mongo } = require('.././server/mongo-connect'); 
const { fetchone,fetch, sitemapcategories, categorycount, fetchrecords, count,sitemapurls, fetchcategories, fetchsubcategories } = require('.././server/find');
const { contactquery } = require('.././server/submit');
const {mailquery} = require('.././server/sendmail');

var auth = function (req, res, next) {
  if(req.connection.remoteAddress === process.env.IP || req.connection.remoteAddress === process.env.IP2){
    next();
}
else{
  res.send(req.connection.remoteAddress);
  // res.status(200).send('Not Authorized.');
}
}

// Post contact query submission pipe
router.post('/contact/query', auth, function(req, res, next) {
  let dataobj = req.body;
  mongo.then((db) => {
    return contactquery(db, dataobj);
  }).then((docs) => {
      dataobj.result = 1;
      dataobj.id = docs.insertedIds[0]
    //   return mailquery(dataobj); 
    //  }).then((doc)=>{

      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({result: 1, id:dataobj.id});
      
     }).catch((e) => {
      res.status(200).send({result: 0, e});
  });
  // res.status(200).send(req.body);
});

// Get categories count
router.get('/listings/categorycount', auth, function(req, res, next) {
    
  mongo.then((db) => {
    return categorycount(db);
  }).then((docs) => {
    // console.log(docs);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({result: docs});
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});
// Get listing count
router.get('/listings/count', auth, function(req, res, next) {
    
  mongo.then((db) => {
    return count(db);
  }).then((docs) => {
   
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({result: docs});
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});
/* GET business data listing. */
router.get('/listings/fetch/:location/:key/:pageno', auth, function(req, res, next) {
  let location = req.params.location;
  let keyword = req.params.key;
  let pageno = req.params.pageno;  
  mongo.then((db) => {
    return fetchrecords(db, pageno, location, keyword);
  }).then((docs) => {
   
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(docs);
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});

/* GET business Categories. */
router.get('/listings/fetchcategories/:pageno', auth, function(req, res, next) {

  let pageno = req.params.pageno;  
  mongo.then((db) => {
    return fetchcategories(db, pageno);
  }).then((docs) => {
   
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(docs);
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});
/* GET business Categories for sitemaps. */
router.get('/listings/sitemapcategories/:pageno', auth, function(req, res, next) {

  let pageno = req.params.pageno;  
  mongo.then((db) => {
    return sitemapcategories(db, pageno);
  }).then((docs) => {
   
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(docs);
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});
//Get top business Sub categories for homepage
router.get('/listings/fetchsubcategories/:category/:count', auth, function(req, res, next) {
  let category = req.params.category.split('-').join(' ').trim();
  let count;
  (req.params.count>50)?count=50:count=req.params.count;    
  mongo.then((db) => {
    return fetchsubcategories(db, category, count);
  }).then((docs) => {
    let arr = [];
    docs.forEach((element, index) => {
      let newar = element._id.split(',');
      newar.forEach((element1, key1) => {
        arr.push(element1.trim());
      });
    });
    let unique = [...new Set(arr)];
    let data;
    (req.params.count>20)?data = unique.slice(0,25):data=unique.slice(0,10);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});
//fetch one record for detail page
router.get('/listings/fetchone/:city/:area/:title/:cid', auth, function(req, res, next) {
  let city = req.params.city;
  let area = req.params.area;
  let title = req.params.title;
  let cid = req.params.cid;  
  // console.log(cid);
  mongo.then((db) => {
    return fetchone(db,city, area, title, cid);
  }).then((docs) => {
   
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(docs);
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});
// get sitemap urls
router.get('/listings/sitemapurls/:pageno', auth, function(req, res, next) {
   let pageno =  req.params.pageno;
  mongo.then((db) => {
    return sitemapurls(db, pageno);
  }).then((docs) => {
   
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(docs);
        
     }).catch((e) => {
      res.status(200).send('fetching error : ',e);
  });
  
});
module.exports = router;
