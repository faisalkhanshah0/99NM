var verifyadmin = (db,params) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_ADMINUSERS_COLLECTION_NAME).find(params,{username:1,_id:0}).toArray().then((docs) => {
            if(docs.length>0){
                let res = {
                    user:docs[0].username,
                    count:docs.length
                }
                resolve(res);
            }
            else{
                let res = {
                    count:0
                }
                resolve(res);
            }

            
        }).catch((e) => {
            reject('fetching unsuccessfull', e);
        });
    });
  }
  var getadsqueue = (db) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COLLECTION_NAME).find({status:2},{status:0,_id:0}).limit(10).toArray().then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject('fetching unsuccessfull', e);
        });
    });
  }
  module.exports = {
      verifyadmin,
      getadsqueue

  }