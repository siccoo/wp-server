import express from "express";
import mongoose from "mongoose";
import Cors from "cors"
import Messages from "./dbMessages.js"
import Pusher from "pusher";

// APP CONFIG
const app = express();
const port = process.env.PORT || 9000;
const connection_url = "mongodb+srv://mikky:siccoo2468@cluster0.ihspf.mongodb.net/whatsappDBase?retryWrites=true&w=majority";

const pusher = new Pusher({
    appId: "1385034",
    key: "603d45ad50b469dbe3c3",
    secret: "0d6728107d8907b9a8bc",
    cluster: "eu",
    useTLS: true
  });

// MIDDLEWARE
app.use(express.json());
app.use(Cors());

// DB Config
mongoose.connect(connection_url, err => {
    if (err) throw err;
    console.log("Connected to MongoDB")
})

// API ROUTES
const db = mongoose.connection
db.once("once", () => {
    console.log("DB Connected");
    const msgCollection = db.collection("whatsappmessages")
    const changeStream = msgCollection.watch()

    changeStream.on("change", change => {
        console.log(change);
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                time: messageDetails.time,
                received: messageDetails.received
            })
        } else {
            console.log("Error triggering Pusher");
        }
    })
})

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