import _ from "lodash";
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
    const data = await clickHouseRepo.getProportionData(filter);
    if (data && data.length) {
      let typeProportion = data.filter((item) => item.category === "type");
      typeProportion = typeProportion.map(item => ({ ...item, percentage: _.round(item.percentage, 2) }))

      let certificateProportion = data.filter(
        (item) => item.category === "certificate"
      );
      certificateProportion = certificateProportion.map(item => ({ ...item, percentage: _.round(item.percentage, 2) }))

      let sexProportion = data.filter((item) => item.category === "sex");
      sexProportion = sexProportion.map(item => ({ ...item, percentage: _.round(item.percentage, 2) }))

      result.type = typeProportion;
      result.certificate = certificateProportion;
      result.sex = sexProportion;
    }
    res.status(200).json({ message: "OK", data: result });
  } catch (e) {
    res.status(500).json({ message: "ERROR: " + e, data: null });
  }
};
