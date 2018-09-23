const { MongoClient, ObjectId } = require('mongodb');

var mongo = new Promise((resolve, reject) => {
    var uri = process.env.MONGO_URI;
    MongoClient.connect(uri, (err, db) => {
        if(err){
            reject('something went wrong in connection',err);
        }
        else{
            resolve(db);
        }
    
    });
});
module.exports = {
    mongo
}