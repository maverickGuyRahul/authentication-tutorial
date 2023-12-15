import 'dotenv/config';
console.log(process.env);

import express from 'express' ;
import bodyParser from 'body-parser' ;
import ejs from "ejs";
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';


const app = express();
const port = 3000;

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


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User" , userSchema);

app.get("/register" , (req, res) => {
    res.render("register");
});

app.post("/register" , (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        email : username,
        password : password
    });

    user.save();

    res.render("secrets");
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
            if(userFound.password === password)
            {
                res.render("secrets");
            }
        }
    
});

app.listen(port , function () 
{
    console.log("Server is Live and Listening on port 3000.")
})