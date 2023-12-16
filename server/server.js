const express = require('express');
const path = require('path');

// make the server
const app = express();
const PORT = process.env.PORT || 3001;
const FIVE_MINUTES = 5 * 60 * 1000;

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Start the API server
app.listen(PORT, () =>
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`),
);