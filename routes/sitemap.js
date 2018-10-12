var xml = require('xml');
var express = require('express');
var router = express.Router();
var axios = require('axios');

var baseuri = process.env.BASEURL;


/* GET users listing. */
// Routing for Main Root sitemap
router.get('/main.xml', function(req, res, next) {

    
var xmlgen = [ { urlset: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'} } ] } ];

xmlgen[0].urlset.push({ url: [{loc: baseuri},{changefreq: 'daily'}, {priority: '1.0'}] });

// xmlgen[0].urlset.push({ url: [{loc: baseuri},{changefreq: 'daily'}, {priority: '0.8'}] });

xmlgen[0].urlset.push({ url: [{loc: baseuri+'/sitemaps/business-categories.xml'},{changefreq: 'daily'}, {priority: '0.8'}] });

xmlgen[0].urlset.push({ url: [{loc: baseuri+'/sitemaps/listings.xml'},{changefreq: 'daily'}, {priority: '0.8'}] });

res.set('Content-Type', 'text/xml');
let xmlstring = xml(xmlgen, { declaration: true });
res.send(xmlstring);

});


// Routing for records listings pages starts
router.get('/listings.xml', function(req, res, next) {

var xmlgen = [ { urlset: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'} } ] } ];

let uri1 = `${process.env.BASEURL}/api/listings/count`
axios.get(uri1)
  .then(function (response) {
        let countbusiness = response.data.result;
        let pagecount = Math.ceil(countbusiness/1000);
        for(let i=1;i<=pagecount;i++){
            let pageuri = `${baseuri}/sitemaps/listings/${i}`
            xmlgen[0].urlset.push({ url: [{loc: pageuri}] });
        }

        res.set('Content-Type', 'text/xml');
        let xmlstring = xml(xmlgen, { declaration: true });
        res.send(xmlstring);


  })
  .catch(function (error) {
    console.log(error);
  });

});


// Routing for record listing result
router.get('/listings/:pageno', function(req, res, next) {

let pageno = req.params.pageno;    
let uri2 = `${process.env.BASEURL}/api/listings/sitemapurls/${pageno}`
axios.get(uri2)
  .then(function (response) {

        var xmlgen = [ { urlset: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'} } ] } ];

        let countbusiness = response.data;
        for(let i=0;i<countbusiness.length;i++){
            let exacturl = `${process.env.BASEURL}/${countbusiness[i].url}/${countbusiness[i].cid}`
            xmlgen[0].urlset.push({ url: [{
              loc: exacturl //{ _cdata: exacturl}
            },{changefreq: 'weekly'}, {priority: '0.9'}] });

        }
        


res.set('Content-Type', 'text/xml');
let xmlstring = xml(xmlgen, { declaration: true });
res.send(xmlstring);

  })
  .catch(function (error) {
    console.log(error);
  });

}); 

router.get('/business-categories.xml', function(req, res, next) {

  var xmlgen = [ { urlset: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'} } ] } ];
  
  let uri1 = `${process.env.BASEURL}/api/listings/count`
  axios.get(uri1)
    .then(function (response) {
          let countbusiness = response.data.result;
          let pagecount = Math.ceil(countbusiness/1000);
          for(let i=1;i<=pagecount;i++){
              let pageuri = `${baseuri}/sitemaps/categorylistings/${i}`
              xmlgen[0].urlset.push({ url: [{loc: pageuri}] });
          }
  
          res.set('Content-Type', 'text/xml');
          let xmlstring = xml(xmlgen, { declaration: true });
          res.send(xmlstring);
          // res.json(response.data);
  
  
    })
    .catch(function (error) {
      console.log(error);
    });
  
  });

// Routing for record listing result
router.get('/categorylistings/:pageno', function(req, res, next) {

  let pageno = req.params.pageno;    
  let uri2 = `${process.env.BASEURL}/api/listings/sitemapcategories/${pageno}`
  axios.get(uri2)
    .then(function (response) {
  
          var xmlgen = [ { urlset: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'} } ] } ];
  
          let categories = response.data;
          let expandlist = [];
          categories.forEach((element, index) => {
            let newarr = element._id.split(',');
            newarr.forEach((element1, key1) => {
              expandlist.push('/best/'+element1.trim().split(' ').join('-'));
              expandlist.push('/delhi/'+element1.trim().split(' ').join('-'));
              expandlist.push('/pune/'+element1.trim().split(' ').join('-'));
              expandlist.push('/noida/'+element1.trim().split(' ').join('-'));
              expandlist.push('/bangalore/'+element1.trim().split(' ').join('-'));
              expandlist.push('/gurgaon/'+element1.trim().split(' ').join('-'));
              expandlist.push('/chennai/'+element1.trim().split(' ').join('-'));
              expandlist.push('/chandigarh/'+element1.trim().split(' ').join('-'));
              expandlist.push('/mumbai/'+element1.trim().split(' ').join('-'));
              expandlist.push('/kolkata/'+element1.trim().split(' ').join('-'));
            });
          });

          for(let i=0;i<expandlist.length;i++){
              let exacturl = `${process.env.BASEURL}${expandlist[i]}`
              xmlgen[0].urlset.push({ url: [{loc: { _cdata: exacturl}},{changefreq: 'weekly'}, {priority: '0.9'}] });
  
          }
          
  
  
  res.set('Content-Type', 'text/xml');
  let xmlstring = xml(xmlgen, { declaration: true });
  res.send(xmlstring);
// res.json(expandlist);
    })
    .catch(function (error) {
      console.log(error);
    });
  
  }); 
module.exports = router;