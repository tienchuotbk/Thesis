const axios = require("axios");

const livyUrl = "http://192.168.1.14"; // Replace with your actual Livy server URL

async function submitPySparkJob() {
  try {
    // Create a new Livy session with the MongoDB Spark connector package
    const sessionResponse = await axios.post(`${livyUrl}/sessions`, {
      kind: "pyspark",
      conf: {
        "spark.jars.packages":
          "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1",
      },
    });
    const sessionId = sessionResponse.data.id;

    // Submit the PySpark code as a job
    const jobResponse = await axios.post(
      `${livyUrl}/sessions/${sessionId}/statements`,
      {
        code: `exec(open("mongo_spark_job.py").read())`,
      }
    );
    const statementId = jobResponse.data.id;

    // Check the job status and retrieve the result
    let statementStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Polling interval
      statementStatus = (
        await axios.get(
          `${livyUrl}/sessions/${sessionId}/statements/${statementId}`
        )
      ).data;
    } while (statementStatus.state !== "available");

    // Output the result
    console.log("Job result:", statementStatus.output);

    // Close the session
    await axios.delete(`${livyUrl}/sessions/${sessionId}`);
  } catch (error) {
    console.error("Error submitting PySpark job:", error);
  }
}

submitPySparkJob();
