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

app.get("/seed_db", async (req, res) => {
    try {
        const eventsData = fs.readFileSync("events.json");
        const events = JSON.parse(eventsData);
        for (let eventDetails of events) {
            new event(eventDetails).save();
        }
        res.status(200).json({ message: "Database seeded successfully"});
    } catch(error) {
        res.status(500).json({ error: error.message});
    }
})

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

// function to get events by title
async function getEventByTitle(eventTitle) {
    const eventDetails = await event.findOne({ title: eventTitle });
    if (! eventDetails) {
        return null;
    }
    return { event: eventDetails };
}

// function to find events by tag
async function getEventsByTag(tag) {
    const events = await event.find();
    const filteredEvents = events.filter(eventData => eventData.eventTags.includes(tag) === true);
    return { events: filteredEvents };
}

// function to get events by type
async function getEventsByType(type) {
    const events = await event.find({ eventType: type });
    return { events: events };
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

// api to get event by title
app.get("/events/title/:title", async (req, res) => {
    const eventTitle = req.params.title;
    try {
        const response = await getEventByTitle(eventTitle);
        if (response === null) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// api to get events by tag
app.get("/events/tag/:tag", async (req, res) => {
    const tag = req.params.tag;
    try {
        const response = await getEventsByTag(tag);
        if (response.events.length === 0) {
            return res.status(404).json({ message: "No events found"});
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// api to get events by type
app.get("/events/event-type/:type", async (req, res) => {
    const type = req.params.type;
    try {
        const response = await getEventsByType(type);
        if (response.events.length === 0) {
            return res.status(404).json({ message: "Events not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

initializeDatabase();