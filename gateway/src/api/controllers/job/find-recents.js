import jobRepo from "../../../models/repository/job.repo.js";
export default async (req, res) => {
    const id = req.params.id;
    const {jobId } = req.query;
    console.log(jobId)
    try {
        const recentJobs = await jobRepo.findRecents(id);
        res.status(200).json({ message: "OKE", data: recentJobs });
    } catch(e){
        console.log(e);
        res.status(404).json({ message: "ERROR" + e, data: [] });
    }
}