import { Startup, Author, Playlist } from "../db/schema";

const express = require('express');
const app = express();
const { Router } = require('express');
const appRouter = Router();
app.use(express.json());

appRouter.post("/startups", async (req: any,res: any)=>{
    console.log("Fetching startups", req.body.query);
    const searchQuery = req.body.query || "";

    try{
        const startups = await Startup.find({
            $or: [
                {title: {$regex: searchQuery, $options: "i"}},
                {description: {$regex: searchQuery, $options: "i"}},
                {pitch: {$regex: searchQuery, $options: "i"}},
                {category: {$regex: searchQuery, $options: "i"}}
            ]
        }).populate({
            path: "author",
            select: "name _id image"
        }).sort({date: -1});
        console.log("Startups fetched successfully");
        // console.log(startups.length);
        return res.status(200).json({startups});
    } catch(error) {
        console.error("Error fetching startups:", error);
        return res.status(500).json({error: "Error fetching startups"});
    }
})

appRouter.get("/startup-details/:id", async (req: any,res: any)=>{
    const startupId = req.params.id;
    console.log("Fetching startup details", startupId);
    if (!startupId) {
        return res.status(400).json({ msg: "ID not provided" });
    } else if (startupId == "undefined") {
        return res.status(400).json({ msg: "ID not provided" });
    }

    try {
        const startupDetails = await Startup.find({ _id: startupId }).populate({
            path: "author",
            select: "name _id image username"
        });

        if (!startupDetails || startupDetails.length === 0) {
            console.log("Startup not found");
            return res.status(404).json({ msg: "Startup not found" });
        }

        console.log("Startup details fetched successfully");
        // console.log("Startup details fetched successfully: ", startupDetails);

        return res.status(200).json({
            startups: startupDetails[0],
            msg: "Success"
        });
    } catch (e) {
        console.error("Error fetching startup details:", e);
        return res.status(500).json(
            { msg: "Error fetching startup details", error: e }
        );
    }
})

appRouter.get("/get-views/:id", async (req: any,res: any)=>{
    const startupId = req.params.id;
    console.log("Fetching views");
    if (!startupId) {
        return res.status(400).json({ msg: "ID not provided" });
    }

    try {
        const views = await Startup.find({ _id: startupId }).select("views");
        // console.log("Views fetched successfully :", views[0].views);
        return res.status(200).json({
            views: views[0].views,
            msg: "Success"
        });
    } catch (e) {
        console.error("Error fetching views:", e);
        return res.status(500).json(
            { msg: "Error fetching views", error: e }
        );
    }
})

appRouter.post("/increment-views/:id", async (req: any,res: any)=>{
    const startupId = req.params.id;
    console.log("Updating views");
    if (!startupId) {
        return res.status(400).json({ msg: "ID not provided" });
    }

    try {
        const startup = await Startup.findOne({ _id: startupId });
        if (!startup) {
            return res.status(404).json({ msg: "Startup not found" });
        }

        startup.views += 1;
        await startup.save();
        console.log("Views updated successfully");
        return res.status(200).json({ msg: "Views updated successfully" });
    } catch (e) {
        console.error("Error updating views:", e);
        return res.status(500).json(
            { msg: "Error updating views", error: e }
        );
    }
});

//author login/signup
appRouter.post("/signin", async (req: any,res: any)=>{
    const {id, name, username, email, image, bio } = req.body;
    try{
        const existingUser = await Author.findOne({
            id: id
        });

        if(!existingUser){
            const newUser = await Author.create({
                id,
                name,
                username,
                email,
                image,
                bio
            });

            console.log("New user created");
            console.log("New user created: ", newUser);
            return res.status(200).json({
                user: newUser._id,
                msg: "New user created"
            });
        }
        
        console.log("User already exists");
        // console.log(existingUser);
        return res.status(200).json({
            user: existingUser._id,
            msg: "User already exists"
        });
    } catch(error){
        console.error("Error logging in:", error);
        return res.status(500).json({error: "Error logging in"});
    }
});

appRouter.post("/get-author/:id", async (req: any,res: any)=>{
    const {id} = req.params;
    console.log("Fetching author");
    try{
        const author = await Author.findOne({
            _id: id
        });

        if(!author){
            console.error("Author not found");
            return res.status(404).json({error: "Author not found"});
        }

        console.log("Author found");
        return res.status(200).json({
            author: author,
            msg: "Author found"
        });
    } catch(error){
        console.error("Error fetching author:", error);
        return res.status(500).json({error: "Error fetching author"});
    }
});

appRouter.get("/startups-by-author/:id", async (req: any,res: any)=>{
    const authorId = req.params.id;
    console.log("Fetching startups by author");
    try{
        const startups = await Startup.find({
            author: authorId
        }).populate({
            path: "author",
            select: "name _id image"
        }).sort({date: -1});

        console.log("Startups fetched successfully");
        return res.status(200).json({
            startups,
            msg: "Startups fetched successfully"
        });

    } catch(error){
        console.error("Error fetching startups by author:", error);
        return res.status(500).json({error: "Error fetching startups by author"});
    }
});

appRouter.get("/startups-by-slug/:slug", async (req: any,res: any)=>{
    const slug = req.params.slug;
    console.log("Fetching startup by slug");
    try{
        const playlist = await Playlist.findOne({
            slug: slug
        }).populate({
            path: "select", 
            populate: {
                path: "author",
                model: "Author",
                select: "name username image email _id id"
            } 
        })

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        return res.status(200).json(playlist);
    } catch(error){
        console.error("Error fetching startup by slug:", error);
        return res.status(500).json({error: "Error fetching startup by slug"});
    }
});

appRouter.post("/create-startup", async (req: any,res: any)=>{
    const {title, description, category, image,  slug, author, pitch} = req.body;
    const finalSlug = slug.current;
    console.log("Creating startup");
    // console.log(req.body);
    try{
        const newStartup = await Startup.create({
            title,
            description,
            category,
            image,
            slug: finalSlug,
            author,
            pitch,
        });
        return res.status(200).json({
            startup: newStartup,
            msg: "Startup created successfully"
        });
    } catch(error){
        console.error("Error creating startup:", error);
        return res.status(500).json({error: "Error creating startup"});
    }
})

appRouter.get("/test", async (req: any,res: any)=>{
    console.log("Test route");
    return res.status(200).json({msg: "Test route"});
});

module.exports = {
    appRouter
};