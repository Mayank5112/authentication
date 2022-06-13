require('dotenv').config();
// using dotenv to secure the secret key  
const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const res = require('express/lib/response');
const mongoose = require('mongoose');
const app = express();
const encrypt = require('mongoose-encryption')



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRETS, encryptedFields: ['password'] })

const User = new mongoose.model("User", userSchema);
app.route("/")
    .get((req, res) => { res.render("home") });

app.route("/login")
    .get((req, res) => { res.render("login") })
    .post((req, res) => {
        const password = req.body.password;
        User.findOne(
            { email: req.body.username },
            (err, founduser) => {
                if (!err) {
                    if (founduser) { if (founduser.password === password) { res.render("secrets") } }
                    else { res.redirect("/login") }
                } else { console.log(err) }
            }
        )
    });

app.route("/register")
    .get((req, res) => { res.render("register") })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save((err) => {
            if (!err) { res.render("secrets") }
            else (console.log(err))
        })
    });


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});