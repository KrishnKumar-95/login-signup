const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs")

const port = process.env.PORT || 8000;
const app = express();

// IMPORTING DATABASE CONNECTION
require("./db/connection");

// IMPORTING THE DATABASE MODEL
const Employee = require("./models/userModel");

// STATIC ITEMS
const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

// TEMPLATE ENGINE
const TemplateEnginePath = path.join(__dirname, "../templates/views")
app.set("view engine", "hbs");
app.set("views", TemplateEnginePath);

// PARTIALS / ESSENTIAL COMPONENTS
const PartialPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(PartialPath);

// MIDDLEWARES WHICH WILL BE USED BETWEEN THE COLLECTION
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/register", (req, res) => {
    res.status(200).render("registration");
});

app.post("/register", async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        // bcrypt.hash => is Asynchronous it will continue other processes dont wait to complete
        // bcrypt.hashSync => is Synchronous it won't continue other processes until it completes
        const passHash = await bcrypt.hash(password, 12);

        if (password === cpassword) {
            const registerEmployee = new Employee({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password: passHash,
                confirmpassword: passHash,
                msg: req.body.msg
            });

            await registerEmployee.save();
            res.status(201).render("homePage", {
                firstName: req.body.firstname,
                lastName: req.body.lastname
            });
        } else {
            res.status(200).render('registration', {
                wrongPass: `Password & Confirm Password must be same...`
            })
        }
    } catch (err) {
        res.status(200).render('registration', {
            wrongPass: err
        })
    }
});

app.get("/homepage", (req, res) => {
    res.status(200).render("homePage")
})

app.get("/loginpage", (req, res) => {
    res.status(200).render("loginpage");
})

app.post("/loginpage", async(req, res) => {
    // USER ENTERED VALUES GET HERE
    const phone = parseInt(req.body.logphone);
    const Epassword = req.body.logpass;


    // HERE WE FIND RELATED DOCUMENT FROM OUR DATABASE LoginSignUp & COLLECTION employees
    const empData = await Employee.findOne({ phone: phone });

    const firstname = empData.firstname;
    const lastname = empData.lastname;
    const password = empData.password;
    const hashCompare = await bcrypt.compare(Epassword, password)

    try {
        if (empData.phone === phone) {
            if (hashCompare == true) {
                res.status(200).render("homePage", {
                    firstName: firstname,
                    lastName: lastname
                });
            } else {
                res.status(200).render("loginpage", {
                    loginmsg: `Invalid Login Details`
                });
            }
        } else {
            res.status(200).render("loginpage", {
                loginmsg: `Invalid Login Details`
            });
        }
    } catch (err) {
        res.status(400).render("loginpage", {
            loginmsg: `error occured`
        });
    }
});

app.get("/allemp", async(req, res) => {
    try {
        let empData = await Employee.find();
        res.status(200).send(empData)
    } catch {
        res.status(400).send(`Error Occured Can't Fetch Data`);
    }
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});