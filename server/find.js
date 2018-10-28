var fetch = (db) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COLLECTION_NAME).find().limit(10).toArray().then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject(e);
        });
    });
  }
  var fetchone = (db, city, area, title, cid) => {
     let id = parseInt(cid);
     let uri1 = city+'/'+area+'/'+title;
     let uri = uri1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COLLECTION_NAME).find({url:uri,cid:id,status:1},{slug:0,url:0,_id:0,status:0}).toArray().then((docs) => {
            resolve(docs[0]);
            
        }).catch((e) => {
            reject(e);
        });
    });
  }
  var count = (db) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COLLECTION_NAME).find().count().then((docs) => {
            console.log('query successful :',docs);
            resolve(docs);
            
        }).catch((e) => {
            console.log(e);
            reject(e);
        });
    });
  }
  var categorycount = (db) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COLLECTION_NAME).distinct('category').length.then((docs) => {
            console.log(docs);
            resolve(docs);
            
        }).catch((e) => {
            reject(e);
        });
    });
  }
  var sitemapurls = (db,pageno) => {
    return new Promise((resolve, reject) => {
        let skipcount = (parseInt(pageno)-1)*1000;
        // removed sort({cid:1})
        db.collection(process.env.MONGO_COLLECTION_NAME).find({},{url:1, cid:1, _id:0}).limit(1000).skip(skipcount).toArray().then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject(e);
        });
    });
  }
  var fetchcategories = (db,pageno) => {
    return new Promise((resolve, reject) => {
        let skipcount = (parseInt(pageno)-1)*20;
        db.collection(process.env.MONGO_COLLECTION_NAME).aggregate([{$group:{_id:'$category', count: { $sum: 1 }}},{$sort:{"count":-1}}, {$skip:skipcount}, {$limit:20}]).toArray().then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject(e);
        });
    });
  }
  var sitemapcategories = (db,pageno) => {
    return new Promise((resolve, reject) => {
        let skipcount = (parseInt(pageno)-1)*250;
        db.collection(process.env.MONGO_COLLECTION_NAME).aggregate([{$group:{_id:'$category', count: { $sum: 1 }}},{$sort:{"count":-1}}, {$skip:skipcount}, {$limit:250}]).toArray().then((docs) => {
            console.log('test',docs);
            resolve(docs);
            
        }).catch((e) => {
            reject(e);
        });
    });
  }
  var fetchsubcategories = (db,category1,count) => {
    let category = category1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let countvalue = parseInt(count);
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COLLECTION_NAME).aggregate([{$match: {category:{$regex: category, $options: 'i'}}}, {$group:{_id:'$category', count: { $sum: 1 }}},{$sort:{"count":-1}}, {$limit:countvalue}]).toArray().then((docs) => {
            
            resolve(docs);
            
        }).catch((e) => {
            reject(e);
        });
    });
  }
  var fetchrecords = (db,pageno, location, keyword) => {
    return new Promise((resolve, reject) => {
        let skipcount = (parseInt(pageno)-1)*20;
        let keyarr = keyword.split('-');
        let searchkey1 = keyarr.join(' ').trim();
        let searchkey = searchkey1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if(location == 'best'){
            db.collection(process.env.MONGO_COLLECTION_NAME).find({ $or: [{category:{$regex: searchkey, $options: 'i'}},{companyname:{$regex: searchkey, $options: 'i'}}]}, {category:1, companyname:1, url:1, cid:1, _id:0}).sort({cid:1}).skip(skipcount).limit(20).toArray().then((docs) => {
                resolve(docs);
                
            }).catch((e) => {
                reject(e); 
            });     
        }
        else{
            let locarr = location.split('-');
            let searchlocation = locarr.join(' ').trim();
            db.collection(process.env.MONGO_COLLECTION_NAME).find({ $or : [{category:{$regex: searchkey, $options: 'i'}, city:{$regex: searchlocation, $options: 'i'}}, {companyname:{$regex: searchkey, $options: 'i'}, city:{$regex: searchlocation, $options: 'i'}}]}, {category:1, companyname:1, url:1, cid:1, _id:0}).sort({cid:1}).skip(skipcount).limit(20).toArray().then((docs) => {
                resolve(docs);
                
            }).catch((e) => {
                reject(e);
            });
        }

        // db.businessdata.aggregate([{$group:{_id:'$category', count: { $sum: 1 }}}, {$skip:0}, {$limit:5}]) // categories with count
        // db.businessdata.find({"category": /.*watch.*/i, "city": /.*delhi.*/i}) //fetch matching records
       
    });
  }
  module.exports = {
      fetch,
      count,
      sitemapurls,
      fetchone,
      fetchcategories,
      fetchrecords,
      fetchsubcategories,
      sitemapcategories,
      categorycount

  }