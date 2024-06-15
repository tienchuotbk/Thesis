import jobRepo from "../../../models/repository/job.repo.js";
import clickHouseRepo from "../../../models/repository/clickhouse.js";

export default async (req, res) => {
  const { id } = req.params;
  try {
    let result = []
    // let data = await runSparkJob();
    const data = await jobRepo.getLine();
    if(data && data.length){
      result = data.map((val)=> val.count)
    }
    const ages = await clickHouseRepo.getProprotionAge();
    res.status(200).json({ message: "OK", data: ages });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "ERROR: " + e, data: null });
  }
};