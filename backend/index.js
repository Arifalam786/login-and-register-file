const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb+srv://arifalamansari:arifalamansari@cluster0.masgy.mongodb.net/dev?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
});

// user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

//model
const User = new mongoose.model("User", userSchema);


// routes
app.post("/login", (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successful", user: user })
            } else {
                res.send({ message: "password did not match" })
            }

        } else {
            res.send({ message: "User not registered" })
        }
    })
})

app.post("/register", (req, res) => {
    const { name, email, password } = req.body
        //check if user exist
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "User already registered" })
        } else {
            // create a new user
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully Registered, Please login now" })
                }
            })
        }
    })

})

app.listen(9002, () => {
    console.log("BE started at port 9002")
})