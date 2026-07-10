import mongoose, { type InferSchemaType } from 'mongoose'

const userSchema = new mongoose.Schema({
    email: { type: String, required: true }, 
    password: { type: String, required: true }
})

export type User = InferSchemaType<typeof userSchema>
export default mongoose.model('User', userSchema)