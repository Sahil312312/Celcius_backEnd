import mongoose from "mongoose";

const sponserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Amount: { type: Number, required: true },
    Type: { type: String, required: true },
    Event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    Coordinator: { type: [String], required: true }
});

const Sponser = mongoose.model('Sponser', sponserSchema);

export default Sponser;