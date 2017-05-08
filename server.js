require('dotenv').config();

const Hapi = require('hapi');
const html = require('swig');
const Inert = require('inert');
const Vision = require('vision');
const firebase = require('firebase');

const db = require('./db');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: 'new-placeful.appspot.com',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const rootRef = firebaseApp.database().ref();


const server = new Hapi.Server();
server.connection({ port: 3000, host: '0.0.0.0' });

server.register([Vision, Inert], (err) => {
  if (err) {
    throw err;
  }

  server.views({
    path: './dist',
    engines: {
      html,
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply.file('./index.html');
    },
  });

  server.route({
    method: 'GET',
    path: '/m/{key}/{title}',
    handler(request, reply) {
      db.guides.find({ key: request.params.key }).limit(1, (error, result) => {
        if (error) console.log(error);

        const guide = { guide: result[0] };

        const placesRef = rootRef.child('places').child(request.params.key);

        placesRef.on('value', (response) => {
          guide.places = response.val();
          reply.view('index', guide);
        });
      });
    },
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'dist',
      },
    },
  });
});


server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
