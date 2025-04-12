const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        enum: ["Online", "Offline", "Both(Online/Offline)"],
        required: true
    },
    hostsSpecialization: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    eventTags: {
        type: [String],
        required: true
    },
    eventDate: {
        type: String
    },
    eventStartTime: {
        type: String,
        required: true
    },
    eventEndTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    speakers: [
        {
            name: String,
            designation: String
        }
    ],
    details: {
        type: String,
         required: true
    }
}, {
    timestamps: true
});

const event = mongoose.model("event", eventSchema);

module.exports = { event };