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
      clickHouseRepo.getTableRoleData(filter),
      clickHouseRepo.getTableExperienceData({
        certificate: level ? parseInt(level) : null,
        field: career,
      }),
      clickHouseRepo.getNumAndSalaryByField({
        experiece: exp ? parseInt(exp) : null,
        certificate: level ? parseInt(level) : null,
      }),
    ]);

    const promiseResults = await totalData;

    // Processing the result
    promiseResults.forEach((promiseResult, index) => {
      if (promiseResult.status === "fulfilled") {
        if (index === 0) {
          result.role_count = promiseResult.value;
        } else if (index === 1) {
          result.exp_count = promiseResult.value?.[0];
        } else {
          result.field_count_salary = promiseResult.value;
        }
      } else {
        console.error(
          `Promise ${index} rejected with reason:`,
          promiseResult.reason
        );
      }
    });
    res.status(200).json({ message: "OK", data: result, success: true });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "ERROR: " + e, data: null, success: false });
  }
};
