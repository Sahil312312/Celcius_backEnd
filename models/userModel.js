const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    points : {
        type: Number,
    },
    Phone_no: {
        type: Number,
        required : true,
      },
    Enrollment: {
        type: String,
        required : true,
    },
    Events: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Event" 
    },
    tc: { type: Boolean, required: true }

    
}, { timestamps: true });


const User = mongoose.model('user', userSchema);

module.exports = User