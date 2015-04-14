var Hapi = require('hapi');
var server = new Hapi.Server();

//configure connection
server.connection({
  host: 'localhost',
  port: 8080,
  routes: {cors: true} 
  //means its cool if someone wants to send ajax request from outside
});

//extends hapi with a plugin, which will take care of the routes for us
var plugins = [{ register: require('hapi-mongodb'),
                 options:{
                   url : "mongodb://127.0.0.1/thePunisher",
                   settings : {db: {"native_parser": false}}
                 }
               }
              ]; 

//load the server with the plugins
server.register(plugins, function (err) {
  if (err) { throw err; } //checks for errors, or else start the server


  server.route([
  { //get one random punishment
    method: 'GET',
    path: '/punish/random',
    handler: function (request, reply) {
      var db = request.server.plugins['hapi-mongodb'].db;
      var array;
      db.collection('punishments').find().toArray(function(err, result){
        if (err) throw err;
        var indexNum = Math.floor(Math.random() * result.length);
        reply(result[indexNum]);
      });
    }
  },
  { //post new punishment
     method: 'POST',
     path: '/punish',
     handler: function(request, reply) {
       var db = request.server.plugins['hapi-mongodb'].db;
       var newPunishment = request.payload.newpunishment;
       db.collection('punishments').insert(newPunishment, function(err, writeResult) {
         if (err) {
           return reply(Happi.error.internal('Internal MongoDB Error', err));
         } else {
           reply(writeResult);
         }
       })
     }
    },
    { //get one random student
    method: 'GET',
    path: '/student/who',
    handler: function (request, reply) {
      var db = request.server.plugins['hapi-mongodb'].db;
      var array;
      db.collection('students').find().toArray(function(err, result){
        if (err) throw err;
        var indexNum = Math.floor(Math.random() * result.length);
        reply(result[indexNum]);
      });
    }
  },
  ])
  
//start the server
  server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
  });
});