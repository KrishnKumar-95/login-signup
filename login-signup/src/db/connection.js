// CONNECTION
const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/LoginSignUp"
mongoose.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log(`Connection Successful...`);
}).catch((err) => {
    console.log(`No Connection`, err)
});
