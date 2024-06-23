import jobRepo from "../../../models/repository/job.repo.js";
import Job from "../../../models/job.js";
import { logger } from "../../../utils/logger.js";
import natural from "natural";
import axios from "axios";
const TfIdf = natural.TfIdf;

function preprocessJob(job) {
  return `${job.title} ${job.category.join(" ")}`.toLowerCase();
}

const selectFields = { _id: 1, title: 1, category: 1, age: 1, description: 1 };
export default async (req, res) => {
  const result = {
    statusCode: 500,
    message: "INTERNAL_SERVER_ERROR",
  };
  try {
    const id = req.params.id;
    const uid = req.query.uid;
    let resultJobs = [];

    const recommend = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/recommendation/${uid}`,
    });
    if(recommend.data){
        resultJobs = recommend.data
    }

    result.statusCode = 200;
    result.message = "OK";
    result.payload = resultJobs;
    res.status(200).json({ message: "OK", payload: resultJobs });
  } catch (e) {

    logger.error(import.meta.url, "APP", e.message);
    res.status(404).json({ message: "Failed", data: result });
  }
};
