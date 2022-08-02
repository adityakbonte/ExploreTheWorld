const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')


mongoose.connect("mongodb://localhost:27017/travel_web")
.then( ()=> console.log("Connection Successful !!!!!!!!!"))
.catch((err)=>console.log(err));

// define schema
const registerSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    mobile :{
        type : String,
        required : true,
        unique : true
    },
    // email :String,
    email : {
        type : String,
        required : true,
        unique : true,
        
    },
    password :{
        type :String,
        required : true,
    },
    cpassword :{
        type : String,
        required : true
    },

    tokens:[
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

});

//generating token
registerSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    }
    catch (err) {
        console.log("Token error");
    }

}

// now we need to create the collections

const Register = new mongoose.model("Register",registerSchema);

module.exports = Register;