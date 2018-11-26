var xml = require('xml');
var express = require('express');
var router = express.Router();
var axios = require('axios');

var baseuri = process.env.BASEURL;
var modtime = '2018-11-26T04:01:11+05:30';

/* GET users listing. */ 
// Routing for Main Root sitemap
router.get('/sitemap_index.xml', function(req, res, next) {

    
  var xmlgen = [ { sitemapindex: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9', "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance", "xmlns:xhtml":"http://www.w3.org/1999/xhtml", "xsi:schemaLocation": "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"} } ] } ];
  
  // xmlgen[0].sitemapindex.push({ sitemap: [{loc: baseuri},{lastmod: '2018-11-26T04:01:11+05:30'}] });
  
  // xmlgen[0].urlset.push({ url: [{loc: baseuri},{changefreq: 'daily'}, {priority: '0.8'}] });
  
  xmlgen[0].sitemapindex.push({ sitemap: [{loc: baseuri+'/sitemaps/business_categories_index.xml'},{lastmod: modtime}] });
  
  xmlgen[0].sitemapindex.push({ sitemap: [{loc: baseuri+'/sitemaps/listings_index.xml'},{lastmod: modtime}] });
  
  res.set('Content-Type', 'text/xml');
  let xmlstring = xml(xmlgen, { declaration: true });
  res.send(xmlstring);
  
  });
  
// Routing for records listings pages starts
router.get('/listings_index.xml', function(req, res, next) {

  var xmlgen = [ { sitemapindex: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9', "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance", "xmlns:xhtml":"http://www.w3.org/1999/xhtml", "xsi:schemaLocation": "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"} } ] } ];
  
  let uri1 = `${process.env.BASEURL}/api/listings/count`
  axios.get(uri1)
    .then(function (response) {
          let countbusiness = response.data.result;
          let pagecount = Math.ceil(countbusiness/1000);
          for(let i=1;i<=pagecount;i++){
              let pageuri = `${baseuri}/sitemaps/listing/listing_${i}_sitemap.xml`
              xmlgen[0].sitemapindex.push({ sitemap: [{loc: pageuri},{lastmod:modtime}] });
          }
  
          res.set('Content-Type', 'text/xml');
          let xmlstring = xml(xmlgen, { declaration: true });
          res.send(xmlstring);
  
  
    })
    .catch(function (error) {
      console.log(error);
    });
  
  });  

  router.get('/business_categories_index.xml', function(req, res, next) {

    var xmlgen = [ { sitemapindex: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'} } ] } ];
    
    let uri1 = `${process.env.BASEURL}/api/listings/count`
    axios.get(uri1)
      .then(function (response) {
            let countbusiness = response.data.result;
            let pagecount = Math.ceil(countbusiness/1000);
            for(let i=1;i<=pagecount;i++){
                let pageuri = `${baseuri}/sitemaps/categorylisting/categorylist_${i}_sitemap.xml`
                xmlgen[0].sitemapindex.push({ sitemap: [{loc: pageuri},{lastmod:modtime}] });
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
router.get('/categorylisting/:pageno', function(req, res, next) {

  let pageno = parseInt(req.params.pageno.split("_")[1]);
  // console.log('asdf'+pageno);    
  let uri2 = `${process.env.BASEURL}/api/listings/sitemapcategories/${pageno}`
  axios.get(uri2)
    .then(function (response) {
  
          var xmlgen = [ { urlset: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9', "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance", "xmlns:image":"http://www.google.com/schemas/sitemap-image/1.1", "xmlns:xhtml":"http://www.w3.org/1999/xhtml", "xsi:schemaLocation":"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"} } ] } ];
  
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
              xmlgen[0].urlset.push({ url: [{lastmod: modtime},{loc: exacturl},{changefreq: 'weekly'}, {priority: '0.9'}] });
  
          }
          
  
  
  res.set('Content-Type', 'text/xml');
  let xmlstring = xml(xmlgen, { declaration: true });
  res.send(xmlstring);
  // res.json({status:pageno});
    })
    .catch(function (error) {
      console.log(error);
    });
  });
// Routing for record listing result
router.get('/listing/:pageno', function(req, res, next) {

  let pageno = parseInt(req.params.pageno.split("_")[1]);
  let uri2 = `${process.env.BASEURL}/api/listings/sitemapurls/${pageno}`
  axios.get(uri2)
    .then(function (response) {
  
          var xmlgen = [ { urlset: [ { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9', "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance", "xmlns:image":"http://www.google.com/schemas/sitemap-image/1.1", "xmlns:xhtml":"http://www.w3.org/1999/xhtml", "xsi:schemaLocation":"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"} } ] } ];
  
          let countbusiness = response.data;
          for(let i=0;i<countbusiness.length;i++){
              let exacturl = `${process.env.BASEURL}/${countbusiness[i].url}/${countbusiness[i].cid}`
              xmlgen[0].urlset.push({ url: [{lastmod: modtime},{loc:exacturl},{changefreq: 'weekly'}, {priority: '0.9'}] });
  
          }
          
  res.set('Content-Type', 'text/xml');
  let xmlstring = xml(xmlgen, { declaration: true });
  res.send(xmlstring);
  
    })
    .catch(function (error) {
      console.log(error);
    });
  
  });
module.exports = router;