import mongoose from "mongoose";

const { Schema, model } = mongoose

const companySchema = new Schema({
    name: { type: String },
    logo: { type: String },
    location: [
        {
            province: { type: String },
            district: { type: String },
            address: { type: String }
        }
    ],
    province: { type: String },
    numberJob: { type: Number, default: 0 }
}, {
    timestamps: true,
    versionKey: false
})

const Company = model("Companies", companySchema)
export default Company