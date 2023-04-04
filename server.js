require("dotenv").config({ path: "./.env" });
const express = require("express");
const session = require("express-session");
const app = express();
var cors = require('cors')
const PORT = process.env.PORT || 4000;
const connectDatabase = require("./models/db");
const indexRouter  =  require('./routes/indexRoute')
 
app.use(cors());
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));