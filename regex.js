var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/because-db';

MongoClient.connect(url, function(err, db) {
  var simple = /because \w+(?=[.!?\n])/;
  var cursor = db.collection('tweets').find( {} );

  var simple_count = 0;

  cursor.each(function (err, tweet) {
    assert.equal(err, null);
    if (tweet !== null) {
      if (simple.test(tweet.text)) {
        console.log(tweet.text);
        simple_count++;
      }
    } else {
      console.log(simple_count);
      db.close();
    }
  });
});
