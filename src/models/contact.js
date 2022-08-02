const mongoose = require("mongoose");
// it is used for custom validator like isEmail

mongoose.connect("mongodb://localhost:27017/travel_web")
.then( ()=> console.log("Connection Successful !!!!!!!!!"))
.catch((err)=>console.log(err));

// define schema
const contactschema = new mongoose.Schema({
    name :{
        type : String,
        required :  true
    },
    email : {
        type : String,
        required : true,
        unique : true,
      
    },
    mobile :{
        type : Number,
        required : true
    },
    subject : {
        type: String 
    },
    message : {
        type : String,
        required : true
    }
});

// now make model to create collection

const Contact = new mongoose.model("Contact",contactschema);

module.exports = Contact;

