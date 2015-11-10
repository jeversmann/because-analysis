var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/because-db';

MongoClient.connect(url, function(err, db) {
  var cursor = db.collection('tweets').find( {} );
  var single  = db.collection('single');

  var add_count = 0;

  cursor.each(function (err, tweet) {
    assert.equal(err, null);
    if (tweet !== null) {
      single.insertOne({
        text: tweet.text,
        _tweet_id: tweet._id
      }, function(err, result) {
        if (err === null) {
          add_count++;
        }
      });
    } else {
      console.log(add_count);
      db.close();
    }
  });
});
