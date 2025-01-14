import express from 'express';
import mongoose from 'mongoose';
const app = express();
const { appRouter } = require("./routes/router");
require('dotenv').config();
app.use(express.json());
const cors = require('cors');

const corsOptions = {
    origin: 'https://launchpad-fe-blond.vercel.app', // Allow only this domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // You can add other HTTP methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify headers you want to allow
};

app.use(cors(corsOptions));

app.use("/api", appRouter);

app.use((err: any,req: any,res: any,next: any)=>{
    res.status(403).json({
        msg: "An error occurred while processing your request",
        err: err
    })
})

const port = process.env.PORT || 4000;
async function main(){
    await mongoose.connect(process.env.MONGODB_URI!)
    .then(()=>{
        console.log("Connected to database");
    })
      
    app.listen(port, ()=>{
        console.log("Server started on port 5000");
    });
}

main();