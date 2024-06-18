import mongoose from "mongoose";

const { Schema, model } = mongoose

const userHistorySchema = new Schema({
    uuid: String,
    filters: {
        type: Number,
        role: Number,
        sex: Number,
        exp: Number,
        age: Number,
        salary: { min: Number, max: Number },
        level: Number,
        career: String,
        text: String,
        province: String
    }
});

// jobSchema.index({ title: "text" })
const userHistory = model("UserHistory", userHistorySchema)
export default userHistory