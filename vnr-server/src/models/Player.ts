import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name : { type: String, required: true, trim: true, maxlength: 30, unique: true }
})