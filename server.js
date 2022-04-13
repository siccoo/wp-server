import express from "express";
import mongoose from "mongoose";
import Cors from "cors"
import Messages from "./dbMessages.js"

// APP CONFIG
const app = express();
const port = process.env.PORT || 9000;
const connection_url = "mongodb+srv://mikky:siccoo2468@cluster0.ihspf.mongodb.net/whatsappDBase?retryWrites=true&w=majority";

// MIDDLEWARE
app.use(express.json());
app.use(Cors());

// DB Config
mongoose.connect(connection_url, err => {
    if (err) throw err;
    console.log("Connected to MongoDB")
})

// API ROUTES
app.get("/", (req, res) => res.status(200).send("WhatsApp MVP Clone - Lakajs"));

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(200).send(data)
    })
})

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    })
})

// LISTEN
app.listen(port, () => console.log(`Listening on localhost: ${port}`))