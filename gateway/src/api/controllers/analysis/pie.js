import clickHouseRepo from "../../../models/repository/clickhouse.js";

export default async (req, res) => {
  try {
    let result = {};
    const data = await clickHouseRepo.getProportionData();
    if (data && data.length) {
      const typeProportion = data.filter((item) => item.category === "type");
      const certificateProportion = data.filter(
        (item) => item.category === "certificate"
      );
      const sexProportion = data.filter((item) => item.category === "sex");
      result.type = typeProportion;
      result.certificate = certificateProportion;
      result.sex = sexProportion
    }
    res.status(200).json({ message: "OK", data: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "ERROR: " + e, data: null });
  }
};
