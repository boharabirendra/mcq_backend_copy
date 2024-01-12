const mongoose = require("mongoose")

async function dbConnection() {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
    } catch (error) {
        console.log(`Error occured while conneting to mongo_db`);
    }
}

module.exports = dbConnection
