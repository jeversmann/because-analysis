var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/because-db';
var fs = require('fs');

var subjects = {};

function track_subject(word) {
  if (subjects[word]) {
   subjects[word]++;
  } else {
   subjects[word] = 1;
  }
}

MongoClient.connect(url, function(err, db) {
  var simple = /because \w+(?=[.!?\n])/;
  var cursor = db.collection('single').find( {} );

  var simple_count = 0;

  cursor.each(function (err, tweet) {
    assert.equal(err, null);
    if (tweet !== null) {
      var text = tweet.text.replace(/\r?\n|\r/g, ".; ");
      var matches = text.match(simple);
      if (matches !== null) {
        console.log(text);
        track_subject(matches[0]);
        simple_count++;
      }
    } else {
      console.log(simple_count);
      fs.writeFile("regex.json", JSON.stringify(subjects), function(err) {
          if(err) {
              return console.log(err);
          }
      
          console.log("The file was saved!");
      }); 
      db.close();
    }
  });
});
