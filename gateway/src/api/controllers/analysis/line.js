import clickHouseRepo from "../../../models/repository/clickhouse.js";

export default async (req, res) => {
  const { id } = req.params;
  try {
    let result = []
    result = await clickHouseRepo.getLineAge();
    res.status(200).json({ message: "OK", data: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "ERROR: " + e, data: null });
  }
};