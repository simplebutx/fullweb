const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
  });

  const db = mongoose.connection;

  module.exports = db;