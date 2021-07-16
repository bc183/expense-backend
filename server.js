const express = require("express");
const mongoose = require("mongoose");

//router import
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();


app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/expense", expenseRoutes);



app.get("/", (req, res) => {
    res.send("Hello world");
})



// server listening in port 3000
app.listen(3000, () => {
    console.log("Server running on port http://localhost:3000");
});


//database connection.
mongoose.connect("mongodb+srv://bar007:msdhoni007@cluster0.sjbln.mongodb.net/expensedb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Database connected.");
});