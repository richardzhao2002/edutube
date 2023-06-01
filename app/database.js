const mongoose = require('mongoose');

module.exports = async () => {
  try {
    // await mongoose.connect('mongodb://localhost/my_database');
    await mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DATABASE, {
      auth: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
      },
      useNewUrlParser: true,
      useUnifiedTopology: true      
    });
    console.log('DB connected successfully');
  } catch (error) {
    console.error(error);
  }
}
