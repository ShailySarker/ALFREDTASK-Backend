const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const database = require("./config/database");
const base = require("./routes/base");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// port fixed
const PORT = process.env.PORT || 1800;

// db connection
database.connect();

// routes
// app.use("/api/v1", base);

app.listen(PORT, () => {
    console.log(`Flashcard server is running on ${PORT}`);
});