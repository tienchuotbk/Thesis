import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userHistorySchema = new Schema({
  uId: String,
  filters: [
    {
      type: Number,
      role: Number,
      sex: Number,
      exp: Number,
      age: Number,
      salary: Number,
      level: Number,
      career: String,
      text: String,
      province: String,
    },
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
const userHistory = model("UserHistory", userHistorySchema);
export default userHistory;
