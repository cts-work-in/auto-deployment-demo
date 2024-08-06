const mongoose = require("mongoose");
const mongoAtlasUri = process.env.MONGO_URL;
console.log("mongoAtlasUri",mongoAtlasUri)

function mongooseConnection() {
    try {
        // Connect to the MongoDB cluster
        mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("Mongoose is connected");
            })
            .catch((e) => {
                console.error("could not connect", e);
            });
    } catch (e) {
        console.error("could not connect", e);
    }

    const dbConnection = mongoose.connection;
    dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
    dbConnection.once("open", () => console.log("Connected to DB!"));
}

module.exports = mongooseConnection;
