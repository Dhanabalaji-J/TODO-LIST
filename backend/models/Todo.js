const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({

    userEmail:String,
    task:String,
    deadline:Date,
    completed:Boolean,

    reminder24Sent:{
        type:Boolean,
        default:false
    },

    reminder3Sent:{
        type:Boolean,
        default:false
    },

    reminder15Sent:{
        type:Boolean,
        default:false
    }

});

module.exports =
mongoose.model(
    "Todo",
    TodoSchema
);