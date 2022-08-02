const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/travel_web")
.then( ()=> console.log("Connection Successful !!!!!!!!!"))
.catch((err)=>console.log(err));

//define Schema
const bookSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    where_to : {
        type : String,
        required : true
    },
    how_many : {
        type : Number,
        required : true
    },
    arraivlas : {
        type :Date,
        required : true
    },
    leaving : {
        type : Date,
        required : true
    }
});
 
// now create a collection
const Bookticket = new mongoose.model("Bookticket", bookSchema)
module.exports = Bookticket;

                                