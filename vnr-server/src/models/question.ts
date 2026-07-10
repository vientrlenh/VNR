import mongoose, { type InferSchemaType } from "mongoose"

const optionSchema = new mongoose.Schema({
    key: { type: String, required: true }, 
    text: { type: String, required: true }, 
    imageUrl: { type: String }, 
}, {
    _id: false
}
)

const questionSchema = new mongoose.Schema({
    type: {
        type: String, 
        enum: ["single", "multiple", "ordering"], 
        required: true,
    }, 
    prompt: { type: String, required: true }, 
    imageUrl: { type: String }, 
    options: { 
        type: [optionSchema], required: true
    }, 
    correctKeys: { type: [String], default: [] }, 
    correctOrder: { type: [String], default: [] }, 
    explaination: { type: String }, 
    topic: { 
        type: String, 
        enum: ["DH8", "DH9", "general"], 
        required: true, 
        index: true
    }, 
    points: {
        type: Number, default: 100
    }, 
    timeLimitSec: { type: Number, default: 10 }, 
    isActive: { type: Boolean, default: true, index: true }, 
}, { timestamps: true })

export type Question = InferSchemaType<typeof questionSchema>
export default mongoose.model('Question', questionSchema)