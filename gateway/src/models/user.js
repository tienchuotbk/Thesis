import mongoose from "mongoose";

const { Schema, model } = mongoose;
const jobSchema = new Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'jobs' 
  },
  time: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { _id: false });

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
        type: String
      },
      text: {
        type: Number
      },
    }, { _id: false } ),
  ],
  recentJobs: {
    type: [jobSchema],
    default: []
  }
});

// jobSchema.index({ title: "text" })
const Users = model("users", userSchema);
export default Users;
