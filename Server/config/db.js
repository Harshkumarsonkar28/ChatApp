const mongoose = require('mongoose');

const dbConnection = async()=>{
    try {
        const MONGO_URI = process.env.MONGO_URI;
        mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("DbConnection Successfully");
    } catch (error) {
        console.log("Not Connected",error)
    }
}

module.exports = dbConnection;
