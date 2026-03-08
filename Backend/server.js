require('dotenv').config();
const cors = require("cors");
const express = require("express");
const connectDB = require('./config/db');
const app = express();

PORT = process.env.PORT || 5000; // assigning port


app.use(express.json()); // alows json format
app.use(cors()); // allows requests from different url
connectDB();

// routers
const authRouter = require('./routes/authRoute');
const eventRouter = require('./routes/eventRoute');
const hackathonRouter = require('./routes/hackathonRoute');

// home page
app.get("/" , (req,res) => {
    res.send("hello");
})



// auth page route 
app.use("/api/auth",authRouter);



// event page route
app.use("/api/events",eventRouter);


app.use("/api/hackathon",hackathonRouter)


app.listen(PORT , () => {
    console.log(`Server is listening on Port ${PORT}`);
})