const mongoose = require("mongoose");
module.exports = async () => {
  const DBuri = `mongodb+srv://sam606166:l1CkXyqpQrwRv8L0@cluster0.m2l1aqc.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(DBuri);
    console.log("Connected to Database.. : ",mongoose.connection.host);
  } catch (e) {
    console.log("error from database", e);
    process.exit(1);
  }
};
