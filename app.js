import 'dotenv/config';
// console.log(process.env);

import express from 'express' ;
import bodyParser from 'body-parser' ;
import ejs from "ejs";
import mongoose from 'mongoose';
import bcrypt from "bcrypt";


const app = express();
const port = 3000;
const saltRounds = 10;
// console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

app.get("/" , (req, res) => {
    res.render("home");
});

mongoose.connect("mongodb+srv://rahul123:123@fullstackbatch1.g0vl8bj.mongodb.net/users");

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User" , userSchema);

app.get("/register" , (req, res) => {
    res.render("register");
});

// console.log(md5('password'));

app.post("/register" , (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            email : req.body.username,
            password : hash
        });

        user.save();

        if(err)
        {
            console.log("There is an error");
        }
        else
        {
            res.render("secrets");
        }
    });
    
});

app.get("/login" , (req, res) => {
    res.render("login");
});

app.post("/login" , async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userFound = await User.findOne({email : username});
    
    if(userFound)
    {
        bcrypt.compare(password, userFound.password, function(err, result) {
            if(result == true)
            {
                res.render("secrets");
            }
            if(err)
            {
                console.log(err.message);
            }
        });

        
    }
    
});

app.listen(port , function () 
{
    console.log("Server is Live and Listening on port 3000.")
})