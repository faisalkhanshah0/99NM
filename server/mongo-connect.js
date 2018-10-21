const { MongoClient, ObjectId } = require('mongodb');

var mongo = new Promise((resolve, reject) => {
    var uri = process.env.MONGO_URI;
    MongoClient.connect(uri, (err, db) => {
        if(err){
            console.log('error occur while connection');
            reject('something went wrong in connection',err);
        }
        else{
            console.log('connection ok');
            resolve(db);
        }
    
    });
});
module.exports = {
    mongo
}