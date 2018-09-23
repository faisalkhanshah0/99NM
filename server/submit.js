var getNextSequenceValue = (db,sequenceName) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COUNTER_COLLECTION_NAME).findAndModify({ _id: sequenceName },[],{ $inc: { "sequence_value": 1 } },{ upsert: true, new: true }).then((docs) => {
            let obj = {
                db,
                cid:docs.value.sequence_value
            }
            resolve(obj);            
        }).catch((e) => {
            reject(e);
        });
    });
}



var contactquery = (db, dataobj) => {
    // console.log('asdf',dataobj);
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_QUERY_COLLECTION_NAME).insert(dataobj).then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject('inserting error :',e);
        });
    });
  }

  var clientquery = (db, dataobj) => {
    // console.log('asdf',dataobj);
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_CLIENT_QUERY_COLLECTION_NAME).insert(dataobj).then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject('inserting error :',e);
        });
    });
  }

  var submitad = (db, dataobj) => {
    return new Promise((resolve, reject) => {
        db.collection(process.env.MONGO_COLLECTION_NAME).insert(dataobj).then((docs) => {
            resolve(docs);
            
        }).catch((e) => {
            reject('inserting error :',e);
        });
    });
  }
  
  module.exports = {
  contactquery,
  submitad,
  getNextSequenceValue,
  clientquery
  }