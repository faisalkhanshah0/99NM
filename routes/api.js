var express = require('express');
var router = express.Router();

const { mongo } = require('.././server/mongo-connect'); 
const { fetchone,fetch, sitemapcategories, categorycount, fetchrecords, count,sitemapurls, fetchcategories, fetchsubcategories } = require('.././server/find');
const { contactquery, clientquery, submitad, getNextSequenceValue } = require('.././server/submit');
const { verifyadmin, getadsqueue } = require('.././server/admin');
const {mailquery} = require('.././server/sendmail');

var auth = function (req, res, next) {
  if(req.connection.remoteAddress === process.env.IP || req.connection.remoteAddress === process.env.IP2 || req.connection.remoteAddress === process.env.IP3){
    console.log('yes-'+req.connection.remoteAddress);
    next();
}
else{
  console.log('no-'+req.connection.remoteAddress);
    next();
  // res.send(req.connection.remoteAddress);
  // res.status(200).send('Not Authorized.');
}
}

// Post an ad submission pipe
router.post('/submit/ad', auth, function(req, res, next) {
  let dataobj = req.body;
  mongo.then((db) => {
      return getNextSequenceValue(db,'cid');
  }).then((docs) => {
      dataobj.cid = docs.cid;
      dataobj.status = 2;
      db = docs.db;
      return submitad(db, dataobj);
  }).then((docs) => {
      let url = process.env.BASEURL+'/'+dataobj.url+'/'+dataobj.cid;
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({result: 1, url});
      
     }).catch((e) => {
      res.status(200).send({result: 0, e});
  });
});

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
// Post contact query submission pipe
router.post('/client/query', auth, function(req, res, next) {
  let dataobj = req.body;
  dataobj.status = 0;
  mongo.then((db) => {
    return clientquery(db, dataobj);
  }).then((docs) => {
    //   return mailquery(dataobj); 
    //  }).then((doc)=>{

      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({result: 1});
      
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
    console.log('test2'+docs);
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
  (req.params.count>100)?count=100:count=req.params.count;    
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
    (req.params.count>20)?data = unique.slice(0,50):data=unique.slice(0,10);
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


//Admin routes
router.post('/admin/login', auth, function(req, res, next) {
  let params = req.body; 
  mongo.then((db) => {
    return verifyadmin(db, params);
  }).then((docs) => {
    req.session.adminuser = docs.user;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({result: docs});
        
     }).catch((e) => {
      res.status(200).send(e);
  });
  
});
//Admin Listing Routes (Listing to be approved / declined)
router.get('/admin/getadsqueue', auth, function(req, res, next) {
  mongo.then((db) => {
    return getadsqueue(db);
  }).then((docs) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({result: docs});
        
     }).catch((e) => {
      res.status(200).send(e);
  });
  
});

router.get('/test', auth, function(req, res, next) {
  
  
    mongo.then((db) => {
    res.status(200).send({status:2});
  })
  .catch((e) => {
      res.status(200).send('fetching error : ',e);
  });


  // mongo.then((db) => {
  //   return count(db);
  // })
  // .then((docs) => {
  //   console.log('test2'+docs);
  //   res.setHeader('Content-Type', 'application/json');
  //   res.status(200).send({result: docs});
        
  // })
  // .catch((e) => {
  //     res.status(200).send('fetching error : ',e);
  // });
  
});
module.exports = router;
