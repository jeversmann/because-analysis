require('dotenv').load();
var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/because-db';

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.stream('statuses/filter', {track: 'because'}, function(stream) {
  stream.on('data', function(tweet) {
    if (tweet.user.followers_count > 100 &&
        tweet.lang === 'en' &&
        tweet.truncated === false) {
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        tweet_collection = db.collection('tweets');
        doc = {
          text: tweet.text,
          time: tweet.created_at,
          id: tweet.id,
          user: {
            name: tweet.user.name,
            id: tweet.user.id,
            screen_name: tweet.user.screen_name,
            verified: tweet.user.verified,
            followers: tweet.user.followers_count,
          }
        }
        tweet_collection.insertOne(doc, function(err, result) {
          assert.equal(null, err);
          console.log(doc);
          db.close();
        });
      });
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
});
