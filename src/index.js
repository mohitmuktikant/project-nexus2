const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const { register } = require("module");

const app = express();

// convert data into json format
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// use EJS as the view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register user
app.post("/signup", async(req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // check if the user already exists in the database
    const existingUser = await collection.findOne({name: data.name});

    if(existingUser) {
        res.send("User already exist. Please enter a different Username.")
    } else {
        // hashing the password using bcrypt
        const saltRounds = 10; // Number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the password with original password 

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});

// Login user
app.post("/login", async(req, res) => {
    try {
        const check = await collection.findONe({name: req.body.username});
        if(!check) {
            res.send("User cannot be found");
        }

        // compare hash password from database
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch) {
            res.render("home");
        } else {
            res.send("wrong password");
        }
    } catch {
        res.send("Wrong Details");
    }
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});