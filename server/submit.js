var contactquery = (db, dataobj) => {
    console.log('asdf',dataobj);
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_QUERY_COLLECTION_NAME).insert(dataobj).then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject('inserting error :',e);
        });
    });
  }
  
  module.exports = {
  contactquery,

  }