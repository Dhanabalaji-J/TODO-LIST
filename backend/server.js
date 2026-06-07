const express = require("express");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const mongoose = require("mongoose");
const cors = require("cors");

require("./reminder");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);


app.get("/", (req, res) => {
    res.send("Todo API Running...");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log(err);
});