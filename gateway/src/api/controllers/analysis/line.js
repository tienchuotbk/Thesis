import clickHouseRepo from "../../../models/repository/clickhouse.js";

export default async (req, res) => {
  try {
    let result = {};
    const { exp, career, level } = req.query;
    const filter = {
      experiece: exp ? parseInt(exp) : null,
      certificate: level ? parseInt(level) : null,
      field: career,
    };
    const totalData = Promise.allSettled([
      clickHouseRepo.getLineAge(filter),
      clickHouseRepo.getLineSalary(filter),
    ]);

    const promiseResults = await totalData;

    // Processing the result
    promiseResults.forEach((promiseResult, index) => {
      if (promiseResult.status === "fulfilled") {
        if (index === 0) {
          result.age = promiseResult.value;
        } else {
          result.salary = promiseResult.value;
        }
      } else {
        console.error(
          `Promise ${index} rejected with reason:`,
          promiseResult.reason
        );
      }
    });
    res.status(200).json({ message: "OK", data: result });
  } catch (e) {
    res.status(500).json({ message: "ERROR: " + e, data: null });
  }
};
