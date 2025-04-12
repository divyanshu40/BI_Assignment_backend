const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");
const { event } = require("./models/event.model");
const { initializeDatabase } = require("./db/db.connect");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    console.log("This server is running");
});

// function to get all events
async function getAllEvents() {
    const events = await event.find();
    return { events: events };
}

// function to get event by id
async function getEventById(eventId) {
    const eventDetails = await event.findById(eventId);
    if (! eventDetails) {
        return null;
    }
    return { event: eventDetails };
}

// api to get all events
app.get("/events", async (req, res) => {
    try {
        const response = await getAllEvents();
        if (response.events.length === 0) {
            return res.status(404).json({ message: "Events not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// api to get event by id
app.get("/events/details/:id", async (req, res) => {
    const eventId = req.params.id;
    try {
        const response = await getEventById(eventId);
        if (response === null) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

initializeDatabase();