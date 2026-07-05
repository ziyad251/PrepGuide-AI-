const mongoose = require("mongoose")



async function connectToDB() {
    const uri = process.env.MONGO_URI

    if (!uri || uri.includes("MONGODB_URI=")) {
        console.error(
            "Invalid MONGO_URI. Set MONGO_URI=mongodb+srv://... in Backend/.env (no duplicate prefix)."
        )
        process.exit(1)
    }

    try {
        await mongoose.connect(uri)
        console.log("Connected to MongoDB:", mongoose.connection.name)
    } catch (err) {
        console.error("MongoDB connection failed:", err.message)
        process.exit(1)
    }
}

module.exports = connectToDB