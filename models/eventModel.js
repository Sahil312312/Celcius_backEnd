const mongoose = require("mongoose");

const eventschema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Fee: {
        type: Number,
        required: true
    },
    Head: {
        type: [String],
        required: true
    },
    subHead: {
        type: [String],
        required: true
    },
    Volunteer: {
        type: [String],
        required: true
    },
    Participants: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
        required: true
    },
    Sponser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponser", 
        required: true
    },
    NetProfit: {
        type: Number,
        required: true
    },
    WinningCost: {
        type: Number,
        required: true
    },
    Winnername: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "user" 
    },
    Team: {
        type: String,
        enum: ["A", "B", "C"],
        required: true
    }
});

const Event = mongoose.model('Event', eventschema);

module.exports = Event;