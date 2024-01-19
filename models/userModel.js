import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
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
        required : true,
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
    
}, { timestamps: true });


const User = mongoose.model('user', userSchema);

export default User;