const express = require("express");
const bodyParser = require("body-parser");
const store = require('store')
const cookieParser=require('cookie-parser')
const app = express();
const hbs = require("hbs");


// const auth = require("./src/middleware/auth")
const Bookticket = require("./src/models/book");
const Register = require("./src/models/register");
const Contact  = require("./src/models/contact");

// here we set the port no on which it will run
const port = 4000;

app.use(bodyParser.urlencoded({extended : true}));

//////////#####
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended : false}));

// To set path for public files like for vid and images
const path = require('path');
//const async = require("hbs/lib/async");
//const { log, Console } = require("console");
app.use(express.static("public")); 

// to set the view engine
app.set("view engine" ,"hbs");

// here it will request to get the index.hbs file
app.get("/",(req,res)=> {
    store.set('user','please login')
    store.set('book',false)
    res.render("index",{
        "name":"",
        "book":store.get('book')
    });
});

// to create a new user in our database for register form
app.post("/register", async(req,res)=> {
    
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password === cpassword){
            const travelUser = new Register({
                name : req.body.name,
                mobile : req.body.mobile,
                email : req.body.email,
                password : password,
                cpassword : cpassword
            })

            const registered = await travelUser.save();
            res.status(201).render("index");

        }
        else{
            res.send("Password is not matching !!");
        }
    }
    catch(error){
        res.status(400).send(error);
    }
});

app.get('/logout',(req,res)=>{

store.set('user','please login')
store.set('book',false)

res.status(200).render('index',{
    "name":store.get('user'),
    "book":store.get('book')
})

})
// TO create a login post method 
app.post("/login" , async(req,res) =>{
    //  res.send({
    //      title: "",
    //      text: "",
    //      icon: "",
    //      confirm : ""
    //  })
    // 1 method 

    // if(!req.body){
    //     res.sendStatus(400);
    // }
    
    // const {email , password } = req.body;
    // Register.findOne({email:email}, (error,user) =>{
    //     if(user){
    //         if(password === user.password){
    //             res.status(201).render("index");
    //         }
    //     }
    //     else{
    //         res.send({"message" : "user not found!"});
    //     }
    // });

    // 2nd method

    try{
        // to get password and email to check
        const email = req.body.email;
        const password = req.body.password;

        //res.send(req.body);
        //console.log(useremail);

        // console.log(`${email} and password is ${password} !!`);a
        const useremail = await Register.findOne({email : email});   // or Register.findOne({email}); beacuase email name is same in database and here also so


        if(useremail.password === password){

        store.set('user',useremail.name);
        console.log(store.get('user'))
        store.set('book',true)


            res.status(201).render("index",{
                "messagelogin":"you are logged in sucessfully",
                "name":store.get('user'),
                "book":store.get('book')
            });
        }
        else{
            res.send("Details is not matching !!");
        }
    }catch(error){
        res.status(400).send("Invalid Email !!");
    }
 

}),
// to create contact post method
app.post("/contact",async(req,res)=>{
    try{
        // data distructure
        const {name,email,mobile,message,subject} = req.body;

        const contact = new Contact({
            name,
            email,
            mobile,
            message,
            subject
        });

        const saved = await contact.save();
        res.status(201).render("index");

        // contact.save().then(() => {
        //     res.send({"message" : "Contact saved!"});
        // }).catch((err) => {
        //    res.send({
        //        "message" : "Error is found"
        //    });
        // });
    }
    catch(error){
        res.status(201).render("index");
    }
}),

// book rout
app.post("/book",async(req,res)=>{
    try{

if(store.get('user')== "please login"){
    res.status(401).render("index",{
        "name":""
    })
}else{
       // data distructure
        const {where_to, how_many,arraivlas,leaving} = req.body;
     
        const userbook = new Bookticket({
            where_to,
            how_many,
            arraivlas,
            leaving
        })
        const booked = await userbook.save();
            res.status(201).render("index");

    }}
    catch(error){
        console.log(error);
        res.status(400).send(error);
    }
})

// rout of the book 
// app.post("/book", auth, async (req, res) => {
//     if (req.body._id == "") {
//         try {
//             const { where_to, how_many, arraivals, leaving} = req.body;
//             const books = new Bookticket({ user: req.user._id, where_to, how_many, arraivals, leaving })
//             const savedbook = await books.save();
//             // console.log("ok");
//             const alerts = [{ message: "Note is Successfully Saved." }]
//             res.status(201).render("Createnote", { alerts: alerts })

//         }
//         catch (err) {
//             res.status(500).render("catcherror", { errormsg: "Something went wrong,error during creating a note.Please refresh the site." })

//         }
//     } 
//     // else {
//     //     //for updating note
//     //     try {
//     //         const { where_to, how_many, arraivals, leaving } = req.body;
//     //         const newbook = {};
//     //         if (title) { newbook.title = title; };
//     //         if (description) { newbook.description = description; };


//     //         let note = await Note.findById(req.body._id);
//     //         if (!note) { res.send("note is not found") }

//     //         if (note.user.toString() !== req.user._id.toString()) {
//     //             res.status(500).render("catcherror", { errormsg: "YOU ARE NOT ALLOWED TO UPDATE THE NOTE." })

//     //         }
//     //         note = await Note.findByIdAndUpdate(req.body._id, { $set: newnote }, { new: true })
//     //         const alerts = [{ message: "Note is Successfully updated." }]
//     //         res.status(201).render("Createnote", {

//     //             alerts: alerts
//     //         })
//     //     } catch (err) {
//     //         res.status(500).render("catcherror", { errormsg: "Something went wrong,error during updating the note.Please refresh the site." })

//     //     }

//     // }
// }),

//  this listen function is used to check the only the port is running or not
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})


