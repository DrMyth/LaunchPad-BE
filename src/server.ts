import express from 'express';
import mongoose from 'mongoose';
const { Router } = require("express");
const app = express();
const { appRouter } = require("./routes/router");
require('dotenv').config();
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use("/api", appRouter);

app.use((err: any,req: any,res: any,next: any)=>{
    res.status(403).json({
        msg: "An error occurred while processing your request",
        err: err
    })
})

async function main(){
    await mongoose.connect(process.env.MONGODB_URI!)
    .then(()=>{
        console.log("Connected to database");
    })
      
    app.listen(5000, ()=>{
        console.log("Server started on port 5000");
    });
}

main();