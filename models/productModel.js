const mongoose = require("mongoose");
const validator = require("validator");
const productModel = new mongoose.Schema(
    {
       
        unique_no:{
            type:String,
            required: [true, "No of pieces is required"],
        },
        pieces: {
            type: Number,
            // required: [true, "No of pieces is required"],
        },
        city: {
            type: String,
            require: [true, "city is required"],
        },
        status: {
            type: String,
           require: [true, "status is required"],
        }, 
    },
    { timestamps: true }
);
const product = mongoose.model("product", productModel);
module.exports = product;