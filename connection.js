// external imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// to access .env variables
dotenv.config();

// creating connection with MongoDB
const dbConnect = () => {
  // parameters for connection
  const connectionParams = { useNewUrlParser: true };

  // connecting with MondoDB
  mongoose.connect(process.env.DB_CONNECTION, connectionParams);
};

// exporting the connection function
module.exports = dbConnect;
