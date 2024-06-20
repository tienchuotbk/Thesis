import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  uId: String,
  filters: [
    Schema({
      type: {
        type: Number
      },
      role: {
        type: Number
      },
      sex: {
        type: Number
      },
      exp: {
        type: Number
      },
      salary: {
        type: Number
      },
      level: {
        type: Number
      },
      career: {
        type: String
      },
      province: {
        type: Number
      },
      text: {
        type: Number
      },
    }, { _id: false } ),
  ],
  recentJobs: [
    {
      jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },
      time: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
});

// jobSchema.index({ title: "text" })
const Users = model("users", userSchema);
export default Users;
