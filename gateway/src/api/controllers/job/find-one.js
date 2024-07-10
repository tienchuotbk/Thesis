import Log from "../../../models/log.js";
import jobRepo from "../../../models/repository/job.repo.js";
import Users from "../../../models/user.js";

export default async (req, res) => {
  const { id } = req.params;
  const uid = req.query.uid;
  try {
    const job = await jobRepo.getById(id);
    if (job && job._id) {
      try {
        await Users.updateOne(
          {
            uId: uid,
          },
          {
            $push: {
              recentJobs: {
                $each: [
                  {
                    jobId: job._id,
                    time: Date.now(),
                  },
                ],
                $sort: { time: -1 },
                $slice: 25,
              },
            },
          },
          { upsert: true }
        );
      } catch (e) {
        console.log(e);
        console.log("Error when push view job: " + e);
      }
    }
    res.status(200).json({ message: "OK", data: job });
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "ERROR" + e, data: null });
  }
};
