import { spawn } from "child_process";
import jobRepo from "../../../models/repository/job.repo.js";
async function runSparkJob() {
  return new Promise((resolve, reject) => {
    const sparkJob = spawn("python3", ["pyspark/lineData.py"]);
    let output = '';
    let errorOutput = '';

    sparkJob.stdout.on("data", (data) => {
      output += data.toString();
    });

    sparkJob.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    sparkJob.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        console.error(`Spark job process exited with code ${code}`);
        console.error(`Error Output: ${errorOutput}`);
        reject(`Spark job process exited with code ${code} and error: ${errorOutput}`);
      }
    });

    // Add a timeout mechanism
    setTimeout(() => {
      sparkJob.kill('SIGKILL');
      reject('Spark job process timed out');
    }, 30000); // Timeout after 60 seconds
  });
}

export default async (req, res) => {
  const { id } = req.params;
  try {
    let result = []
    // let data = await runSparkJob();
    const data = await jobRepo.getAgeLine();
    if(data && data.length){
      result = data.map((val)=> val.count)
    }
    // if(data && data.length){
    //   str = data.split("data=")[1].split(",\n").join()
      // console.log(JSON.parse(str))

      // res = JSON.parse(data.split("data=")[0].replace("\n", ""))
    // }
    res.status(200).json({ message: "OK", data: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "ERROR: " + e, data: null });
  }
};