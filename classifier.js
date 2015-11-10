var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/because-db';
var Promise = require('promise');
var StatefulProcessCommandProxy = require('stateful-process-command-proxy');

var statefulProcessCommandProxy = new StatefulProcessCommandProxy(
    {
      name: "classifier",
      max: 20,
      min: 10,
      idleTimeoutMS: 10000,
 
      logFunction: function(severity,origin,msg) {
          //console.log(severity.toUpperCase() + " " +origin+" "+ msg);
      },
 
      processCommand: '/bin/bash',
      processArgs:  ['-s'],
      processRetainMaxCmdHistory : 10,
 
      processInvalidateOnRegex :
          {
            'any':[{regex:'.*error.*',flags:'ig'}],
            'stdout':[{regex:'.*error.*',flags:'ig'}],
            'stderr':[{regex:'.*error.*',flags:'ig'}]
          },
 
      processCwd : './',
      processEnvMap : {"testEnvVar":"value1"},
      processUid : null,
      processGid : null,
 
      initCommands: [ 'testInitVar=test' ],
 
      validateFunction: function(processProxy) {
          return processProxy.isValid();
      },
 
      preDestroyCommands: [ 'echo This ProcessProxy is being destroyed!' ]
    });
 
// echo the value of our env variable set above in the constructor config
 

MongoClient.connect(url, function(err, db) {
  var cursor = db.collection('tweets').find( {} ).limit(100);

  var classify_count = 0;

  cursor.each(function (err, tweet) {
    assert.equal(err, null);
    if (tweet !== null) {
      //var text = tweet.text.replace(/\r?\n|\r/g, ".; ");
      statefulProcessCommandProxy.executeCommand('python classify.py "' + tweet.text + '"')
        .then(function(cmdResult) {
            console.log("testEnvVar value: Stdout: " + cmdResult.stdout);
        }).catch(function(error) {
            console.log("Error: " + error);
        });
    } else {
      //console.log(classify_count);
      db.close();
    }
  });
});
