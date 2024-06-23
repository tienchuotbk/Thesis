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
    const uid = req.params.id;
    // console.log(req.query)
    // const uid = req.query.uid;

    // console.log(req.query)
    let resultJobs = null;

    // const job = await jobRepo.getById(id, selectFields)
    // if (job) {
    // const currentJobText = preprocessJob(job)
    // const jobs = await Job.find({ _id: { $ne: job._id } }, { ...selectFields, location: 1, company: 1, salary: 1, logo: 1 })

    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:5000/recommendation/${uid}`,
    });
    if(res.data){
        resultJobs = res.data
        // console.log(resultJobs)
    }

    // let url = `https://127.0.0.1:5000/recommendation/${uid}`;
    // const data = await fetch(url, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    // const data_josn = await data.json();
    // console.log(data_josn)

    // const tfidf = new TfIdf();
    // jobs.forEach(job => {
    //     const jobText = preprocessJob(job);
    //     tfidf.addDocument(jobText);
    // });

    // // Tính toán độ tương đồng cosine
    // const similarities = [];
    // tfidf.tfidfs(currentJobText, (i, measure) => {
    //     similarities.push({ job: jobs[i], score: measure });
    // });
    // // Sắp xếp các job theo độ tương đồng
    // similarities.sort((a, b) => b.score - a.score);

    // // Lấy top N job được đề xuất
    // const topN = 5;
    // const recommendedJobs = similarities.slice(0, topN).map(similarity => {
    //     const { _id, title, logo, company, salary, location } = similarity.job
    //     return { _id, title, logo, company, salary, location }
    // });

    // console.log(resultJobs);

    result.statusCode = 200;
    result.message = "OK";
    result.payload = resultJobs;
    // } else {
    //     result.statusCode = 400;
    //     result.message = "Job not found"
    //     result.payload = null
    // }
  } catch (e) {
    logger.error(import.meta.url, "APP", e.message);
  }
  return res.status(result.statusCode).json(result);
};
