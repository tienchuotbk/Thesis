import mongoose from "mongoose";

const { Schema, model } = mongoose

const jobSchema = new Schema({
    age: {
        type: {
            type: Number,
            min: Number,
            max: Number
        }
    },
    benefit: [String],
    category: [String],
    certificate: { type: String },
    company: { type: String },
    description: [String],
    experience: {
        type: {
            type: Number,
            fixed: Number,
            max: Number
        }
    },
    expiration: { type: Date },
    location: [
        {
            province: { type: String },
            district: { type: String },
            address: { type: String }
        }
    ],
    requirement: [String],
    role: { type: Number },
    salary: {
        type: { type: Number },
        min: { type: Number },
        max: { type: Number }
    },
    sex: { type: String, default: null },
    title: { type: String },
    type: [Number],
    update_time: { type: Date },
    url: { type: String }
}, {
    timestamps: true
})

const Job = model("Job", jobSchema)
export default Job