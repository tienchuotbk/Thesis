import jobRepo from "../../../models/repository/job.repo.js"
import Job from '../../../models/job.js'
import { logger } from "../../../utils/logger.js"
import natural from 'natural'
const TfIdf = natural.TfIdf

function preprocessJob(job) {
    return `${job.title} ${job.category.join(' ')} ${job.description.join(" ")} age: ${job.age.min} - ${job.age.max}`.toLowerCase();
}

const selectFields = { _id: 1, title: 1, category: 1, age: 1, description: 1 }
export default async (req, res) => {
    const result = {
        statusCode: 500,
        message: "INTERNAL_SERVER_ERROR"
    }
    try {
        const id = req.params.id

        const job = await jobRepo.getById(id, selectFields)
        if (job) {
            const currentJobText = preprocessJob(job)
            const jobs = await Job.find({ _id: { $ne: job._id } }, { ...selectFields, location: 1, company: 1, salary: 1, logo: 1 })

            const tfidf = new TfIdf();
            jobs.forEach(job => {
                const jobText = preprocessJob(job);
                tfidf.addDocument(jobText);
            });

            // Tính toán độ tương đồng cosine
            const similarities = [];
            tfidf.tfidfs(currentJobText, (i, measure) => {
                similarities.push({ job: jobs[i], score: measure });
            });
            // Sắp xếp các job theo độ tương đồng
            similarities.sort((a, b) => b.score - a.score);

            // Lấy top N job được đề xuất
            const topN = 5;
            const recommendedJobs = similarities.slice(0, topN).map(similarity => {
                const { _id, title, logo, company, salary, location } = similarity.job
                console.log({ logo })
                return { _id, title, logo, company, salary, location }
            });

            result.statusCode = 200;
            result.message = "OK"
            result.payload = recommendedJobs
        } else {
            result.statusCode = 400;
            result.message = "Job not found"
            result.payload = null
        }
    } catch (e) {
        logger.error(import.meta.url, "APP", e.message)
    }
    return res.status(result.statusCode).json(result)
}