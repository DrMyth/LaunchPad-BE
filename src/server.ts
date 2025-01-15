import express from 'express';
import mongoose from 'mongoose';
const app = express();
const { appRouter } = require("./routes/router");
require('dotenv').config();
app.use(express.json());
const cors = require('cors');

const corsOptions = {
    origin: ['https://launchpad-fe-blond.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

app.use("/api", appRouter);

app.use((err: any,req: any,res: any,next: any)=>{
    res.status(403).json({
        msg: "An error occurred while processing your request",
        err: err
    })
})

app.get("/", (req, res) => {
    res.send("Welcome to Launchpad API");
});

export default app;

async function connectDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      console.log('Connected to database');
    } catch (err) {
      console.error('Error connecting to database:', err);
    }
  }
  
connectDatabase();