const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const database = require("./config/database");
const base = require("./routes/base");

dotenv.config();
const app = express();

// middleware
const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization,Content-Type',
};
app.use(cors(corsOptions));
app.use(express.json());

// port fixed
const PORT = process.env.PORT || 1800;

// db connection
database.connect();

// routes
app.use("/api/v1", base);

app.listen(PORT, () => {
    console.log(`Flashcard server is running on ${PORT}`);
});