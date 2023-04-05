require("dotenv").config({ path: "./.env" });
const express = require("express");
const session = require("express-session");
const app = express();
const cookieParser = require("cookie-parser");
var cors = require('cors')
const PORT = process.env.PORT || 4000;
const connectDatabase = require("./models/db");
const indexRouter  =  require('./routes/indexRoute')
 
app.use(
    require("cors")({ origin: "http://localhost:3000", credentials: true })
);
connectDatabase();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
if (process.env.NODE_ENV === "production") {
    const path = require("path");
    app.get("/", (req, res) => {
        app.use(express.static(path.resolve(__dirname, "views", "build")));
        res.sendFile(path.resolve(__dirname, "views", "build", "index.html"));
    });
}

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));