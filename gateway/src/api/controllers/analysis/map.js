import clickHouseRepo from "../../../models/repository/clickhouse.js";

export default async (req, res) => {
  try {
    const { exp, career, level } = req.query;
    const filter = {
      experiece: exp ? parseInt(exp) : null,
      certificate: level ? parseInt(level) : null,
      field: career,
    };
    let result = [];
    result = await clickHouseRepo.getProvincesData(filter);
    res.status(200).json({ message: "OK", data: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "ERROR: " + e, data: null });
  }
};
