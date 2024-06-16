import mongoose from "mongoose";

export const convertObjectId = (id) => {
    return new mongoose.Types.ObjectId(id);
}