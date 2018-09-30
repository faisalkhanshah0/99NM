var express = require('express');
var router = express.Router();
var fs = require('fs');
var axios = require('axios');
var randomhex = '0123456789ABCDEF';
var robotcheck = 1;
/* GET home page. */


router.get('/', function(req, res, next) {

  fs.readFile(__dirname+'/../homesubcategories.json', 'utf8', (err, string)=>{
    if(err){
      // return res.json(err); 
    }
    let data = {
      restaurant: [],
      service:[],
      jobs:[],
      realestate:[],
      electronics:[],
      shopping:[],
      training:[],
      vehicle:[]
    };
    let subcategories = JSON.parse(string);
    let keys = Object.keys(subcategories)
    keys.forEach(element => {
      subcategories[element].forEach((element1, index1) => {
        let obj={
          url:process.env.BASEURL+'/best/'+element1.trim().split(' ').join('-'),
          keyword:element1
        }
        
        data[element].push(obj);
      });      
    });
    res.render('index', {keywords, description, pageurl, imgurl, sitename, robotcheck,title,data });
  });
  let title = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
  let keywords = `99 near me, 99nearme, business listing, business news & updates, local business, business marketing, post an ad, advertise, services contacts, restaurants, services, jobs, real estate, shops, electricians, tutors, tranings, repair services, companies, list of restaurant, list of dentist, list of hospitals, salon near me, near me, nearby,shopping centers,store address,IT services`;
  let description = `99nearme - Checkout local businesses and professionals services near you and me like restaurants, shops, electricians, tutors, tranings, repair services, companies etc from the authentic source.`;
  let pageurl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let imgurl = req.protocol + '://' + req.get('host') + '/assets/images/99nearme.png';
  let sitename = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
    
});
router.get('/index.html', function(req, res, next) {
  res.redirect(301, process.env.BASEURL+'/');
  });
router.get('/sitemap.xml', function(req, res, next) {
  res.redirect(301, process.env.BASEURL+'/sitemaps/main.xml');
  });
router.get('/about', function(req, res, next) {
  let title = "About 99 Nearme - Local Search Engine, Business Listing, Business Articles";
  let keywords = `99 near me, 99nearme, business listing, business news & updates, local business, business marketing, post an ad, advertise, services contacts, restaurants, services, jobs, real estate, shops, electricians, tutors, tranings, repair services, companies, list of restaurant, list of dentist, list of hospitals, salon near me, near me, nearby,shopping centers,store address,IT services`;
  let description = `99nearme - Checkout local businesses and professionals services near you and me like restaurants, shops, electricians, tutors, tranings, repair services, companies etc from the authentic source.`;
  let pageurl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let imgurl = req.protocol + '://' + req.get('host') + '/assets/images/99nearme.png';
  let sitename = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
  res.render('about', {robotcheck, title, keywords, description, pageurl, imgurl, sitename });
});
router.get('/privacy-policy', function(req, res, next) {
  let title = "Privacy Policy | 99 Nearme";
  res.render('privacy-policy', { title });
});
router.get('/refund-policy', function(req, res, next) {
  let title = "Refund Policy | 99 Nearme";
  res.render('refund-policy', { title });
});
router.get('/terms-of-use', function(req, res, next) {
  let title = "Terms of Use | 99 Nearme";
  res.render('termsofuse', { title });
});
router.get('/contact', function(req, res, next) {
  let title = "Contact Us | 99 Nearme";
  res.render('contact', {robotcheck, title });
});
router.get('/disclaimer', function(req, res, next) {
  let title = "Disclaimer | 99 Nearme";
  res.render('disclaimer', { title });
});
router.get('/post-an-ad', function(req, res, next) {
  let title = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
  
  res.render('post-an-ad', {robotcheck, title });
});


//Routing for Business Categories Page Starts
router.get('/category', function(req, res, next) {
res.redirect(301, process.env.BASEURL+'/business-categories/1');
});
router.get('/categories', function(req, res, next) {
  res.redirect(301, process.env.BASEURL+'/business-categories/1');
});
router.get('/business-categories', function(req, res, next) {
  res.redirect(301, process.env.BASEURL+'/business-categories/1');
});
router.get('/business-categories/:pageno', function(req, res, next) {
  let pageno = parseInt(req.params.pageno);
  let pageup;
  let pagelow;
  let pagecode;
  let title = "Business Categories | 99 Nearme - Local Search Engine";
  let keywords = `99 near me, 99nearme, business listing, business news & updates, local business, business marketing, post an ad, advertise, services contacts, restaurants, services, jobs, real estate, shops, electricians, tutors, tranings, repair services, companies, list of restaurant, list of dentist, list of hospitals, salon near me, near me, nearby,shopping centers,store address,IT services`;
  let description = `99nearme - Checkout local businesses and professionals services near you and me like restaurants, shops, electricians, tutors, tranings, repair services, companies etc from the authentic source.`;
  let pageurl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let imgurl = req.protocol + '://' + req.get('host') + '/assets/images/99nearme.png';
  let sitename = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
  
  if(pageno>5){
  pagelow = pageno-4;
    pageup = pageno+4;
  }
  else{

    pagelow = 1;
    pageup = 9;
  }
  let urlforpagination = `/business-categories/`
  let uri5 = `${process.env.BASEURL}/api/listings/fetchcategories/${pageno}`
      axios.get(uri5)
        .then(function (response) {

	            let businesscategories = response.data;
              if(businesscategories.length < 20 && businesscategories.length > 1){
               if(pageno<9){
                pagecode = 0;
                pagelow = pageno-(pageno-1);
                pageup = pageno;
               }
               else{
                pagecode = 0;
                pagelow = pageno-8;
                pageup = pageno;
               }

		
              }
              else if(businesscategories.length == 0){
                // pagelow = pageno;
                // pageup = pageno;
                // pagecode = 0;

                res.redirect(301, process.env.BASEURL+'/404');                
              }
              else{
		console.log('f8.1');
		}

              let dataobj = {
                urlforpagination, pagelow, pageup, pagecode, pageno
              }

              businesscategories.forEach((element, index) => {
                businesscategories[index].slug = element._id.trim().split(' ').join('-').toLowerCase();
              });

              // res.json(businesscategories);
              res.render('categories', { title, keywords, description, sitename, pageurl, imgurl, dataobj, businesscategories, robotcheck });
        })
        .catch(function (error) {
         
         console.log(error);
        // res.json({error:error});
         res.redirect(301, process.env.BASEURL+'/404');
        });

});
//Routing for Business Categories Page Ends

//Routing for Articles Listing Page Starts
router.get('/articles', function(req, res, next) {
  let title = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
  
  res.render('articles-listing', { title, robotcheck });
});
//Routing for Articles Listing Page Ends

//Routing for 404 Page Starts
router.get('/404', function(req, res, next) {
  let title = "404 Page Not Found | 99 Nearme";
  res.status(404).render('404', {title});
});
//Routing for 404 Page Ends



//Routing for search page Starts
router.get('/:location/:key', function(req, res, next) {
  res.redirect(301, process.env.BASEURL+'/'+req.params.location+'/'+req.params.key+'/1');
});
router.get('/:location/:key/:pageno', function(req, res, next) {
  
  let location = req.params.location;
  let key = req.params.key;
  let key1 = key.split('-').join(' ').trim();
  let searchstatement;
  let title;
  //pagination code1 starts
  let pageno = parseInt(req.params.pageno);
  let pageup;
  let pagelow;
  let pagecode;
  if(pageno>5){
    pagelow = pageno-4;
    pageup = pageno+4;
  }
  else{
    pagelow = 1;
    pageup = 9;
  }

  let urlforpagination = `/${location}/${key}/`;
  let description, keywords,pageurl, imgurl, sitename;
//pagination code1 starts
  if(location == 'best'){

    searchstatement = `Best ${key1} near me - 99nearme`;
    title = `${key1} near me, Best ${key1} near me - 99nearme`;
    keywords = `${key1} near me, Best ${key1} near me, ${key1} service near by, ${key1} near by, Best ${key1}, ${key1} shop, ${key1} shop near me, ${key1} near me open now, ${key} nearby`;
    description = `Check out collection of Best ${key1} near me, ${key1} nearby to connect with top best ${key1} near me & you and get amazing offers, discounts on ${key1} services.`;
    pageurl = req.protocol + '://' + req.get('host') + req.originalUrl;
    imgurl = req.protocol + '://' + req.get('host') + '/assets/images/99nearme.png';
    sitename = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
    
  }
  else{
    let location1 = location.split('-').join(' ').trim();
    searchstatement = `Best ${key1} near me in ${location1}`;
    title = `${key1} near me, Best ${key1} in ${location1} - 99nearme`;
    description = `Check out collection of Best ${key1} in ${location1}, ${key1} nearby to connect with top best restaurants near me & you and get amazing offers, discounts on ${key1} services.`;
    keywords = `${key1} near me, Best ${key1} near me, ${key1} service in ${location1}, Best ${key1} in ${location1}, ${key1} shop in ${location1}, ${key1} shop, ${key1} shop near me, ${key1} near me open now, ${key} nearby`;
    pageurl = req.protocol + '://' + req.get('host') + req.originalUrl;
    imgurl = req.protocol + '://' + req.get('host') + '/assets/images/99nearme.png';
    sitename = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
   
  }
  // console.log(cid);
  let uri4 = `${process.env.BASEURL}/api/listings/fetch/${location}/${key}/${pageno}`;
  let uri6 = `${process.env.BASEURL}/api/listings/fetchsubcategories/${key}/100`;
  axios.all([
    axios.get(uri4),
    axios.get(uri6)
  ]).then(axios.spread(function (response, subcategoriesresponse) {
              
              let subcategoriesarr = subcategoriesresponse.data;
              let subcategories = [];
              subcategoriesarr.forEach(element => {
                let keyslug = element.trim().split(' ').join('-').toLowerCase();
                let url = `/${location}/${keyslug}`;
                let obj = {
                  name:element,
                  url
                } 
                subcategories.push(obj);               
              });
              let businesslisting = response.data;
              let data = [];
              businesslisting.forEach((element, index) => {
                let shuffled = ('#'+randomhex.split('').sort(function(){return 0.5-Math.random()}).join('')).substring(0,7);
                data[index] = {
                  color: shuffled,
                  name: element.companyname,
                  initials: element.companyname.trim().charAt(0),
                  url:process.env.BASEURL+'/'+element.url+'/'+element.cid,
                  category: element.category
                }
              });

              if(businesslisting.length < 20 && businesslisting.length > 1){
                if(pageno<9){
                  pagecode = 0;
                  pagelow = pageno-(pageno-1);
                  pageup = pageno;
                 }
                 else{
                  pagecode = 0;
                  pagelow = pageno-8;
                  pageup = pageno;
                 }
              }
              else if(businesslisting.length == 0){
                pagelow = pageno;
                pageup = pageno;
                pagecode = 0;
                // res.redirect(301, process.env.BASEURL+'/404');                
              }
              else{

              }
              let dataobj = {
                urlforpagination, pagelow, pageup, pagecode, pageno
              }
              res.render('business-listing', {subcategories,keywords, description, pageurl,imgurl,sitename,title,dataobj,robotcheck,searchstatement, data });

        }))
        .catch(function(error) {
          res.redirect(301, process.env.BASEURL+'/404');
        });
});
//Routing for search page Ends

//Routing for Article page Starts
router.get('/article/:title', function(req, res, next) {
  res.render('article', { title: '99 Nearme - Local Search Engine, Business Listing, Business Articles' });
});
//Routing for Article page Ends

//Routing for business Detail page starts
router.get('/:city/:area/:title/:id', function(req, res, next) {
  let city = req.params.city;
  let area = req.params.area;
  let title = req.params.title;
  let cid = req.params.id;
  let shuffled = ('#'+randomhex.split('').sort(function(){return 0.5-Math.random()}).join('')).substring(0,7);
                
  // console.log(cid);
  let uri3 = `${process.env.BASEURL}/api/listings/fetchone/${city}/${area}/${title}/${cid}`
axios.get(uri3)
  .then(function (response) {
        let businessdetail = response.data;
        
        if(businessdetail == undefined || businessdetail == ''){
          return res.redirect(process.env.BASEURL+'/404');  
        }
        // console.log(businessdetail);
        let cid = businessdetail.cid;
        let arr = businessdetail.city.split(",");
        let area = arr[0].trim();
        let city = arr[1].trim();
        let newc = businessdetail.companyname.split(",");
        let company = newc[0].trim();
        let mainservice = businessdetail.category.split(',')[0];
        let description = `${company} in ${businessdetail.city}, Check out contact details of ${company}, Listed with category ${businessdetail.category}, postal address, contact number, opening hours`;
        let keywords = `${company} service, ${company} service in ${city}, ${company} service in ${area} ${city}, ${company} ${businessdetail.category} services contact detail in ${area}, ${city}. ${company} in ${area}, ${city}, ${company} in ${city}, ${company} in ${area}, ${businessdetail.category} near me, best ${businessdetail.category} near me, ${company} near me`;
        let pageurl = req.protocol + '://' + req.get('host') + req.originalUrl;
        let imgurl = req.protocol + '://' + req.get('host') + '/assets/images/99nearme.png';
        let sitename = "99 Nearme - Local Search Engine, Business Listing, Business Articles";
        let title = `${company},${city} - ${mainservice} in ${area}, ${city}`;
        let initials = company.trim().charAt(0);
        res.render('detail-page', {title, robotcheck, shuffled, company, initials, businessdetail, city, area, description, sitename, keywords, pageurl, imgurl,cid });


  })
  .catch(function (error) {
    res.redirect(301, process.env.BASEURL+'/404');
  });
  
});
//Routing for business Detail page Ends

//Routing for Rest pages goes to 404 starts
router.get('*', function(req, res, next) {
  let title = "404 Page Not Found | 99 Nearme";
  res.status(404).render('404', { title });
});
//Routing for Rest pages goes to 404 Ends
module.exports = router;
