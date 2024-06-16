import { provinces } from "../../contants/analysis.js";
import client from "../../models/clickhouse.js";
const clickHouseRepo = {
  getProprotionAge: async () => {
    const res = await client.query({
      query: `
            SELECT
                sex AS value,
                COUNT(*) AS count,
                COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
            FROM
                thesis.jobs
            GROUP BY
                sex
            ORDER BY
                sex;
            `,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },
  getLineAge: async () => {
    let result = [];
    const res = await client.query({
      query: `
            WITH array(16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60) AS values_array
            SELECT
                value,
                countIf(age.type = 1 AND age.min <= value AND age.max >= value) +
                countIf(age.type = 2 AND age.fixed = value) +
                countIf(age.type = 3 AND age.max > value) +
                countIf(age.type = 4 AND age.min < value) AS count
            FROM
                thesis.jobs
            ARRAY JOIN values_array AS value
            GROUP BY
                value
            ORDER BY
                value;`,
      format: "JSONEachRow",
    });
    let data = await res.json();
    if (data && data.length) {
      result = data.map((val) => parseInt(val.count));
    }
    return result;
  },
  getProvincesData: async () => {
    let result = [];
    const res = await client.query({
      query: `
      WITH 
          array(${provinces.map((val)=> `\'${val}\'`).join(",")}) AS provinces
      SELECT
          province,
          COUNT(DISTINCT _id) AS count,
          AVG(
              CASE
                WHEN salaryType = 1 THEN (salaryMin + salaryMax) / 2
                WHEN salaryType = 2 THEN salaryFixed
                WHEN salaryType = 3 THEN salaryMax
                WHEN salaryType = 4 THEN salaryMin
              END
          ) as average
      FROM (
          SELECT 
              _id,
              loc.province as province,
              salary.type as salaryType,
              salary.min as salaryMin,
              salary.max as salaryMax,
              salary.fixed as salaryFixed
          FROM 
              thesis.jobs 
          ARRAY JOIN 
              location AS loc 
          WHERE 
              loc.province != ''
      )
      GROUP BY 
          province
      ORDER BY
          province;`,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },

  // calculateAverageSalaryByProvince: async () => {
  //   let result = []
  //   const res = await client.query({
  //     query: `
  //       SELECT
  //         province,
  //           AVG(
  //             CASE
  //               WHEN salaryType = 1 THEN (salaryMin + salaryMax) / 2
  //               WHEN salaryType = 2 THEN salaryFixed
  //               WHEN salaryType = 3 THEN salaryMax
  //               WHEN salaryType = 4 THEN salaryMin
  //             END
  //           ) as average
  //       FROM
  //         (
  //           SELECT 
  //             _id,
  //             loc.province as province,
  //             salary.type as salaryType,
  //             salary.min as salaryMin,
  //             salary.max as salaryMax,
  //             salary.fixed as salaryFixed
  //           FROM 
  //             thesis.jobs 
  //           ARRAY JOIN 
  //             location AS loc
  //           WHERE loc.province != ''
  //         )
  //       GROUP BY province
  //     `,
  //     format: "JSONEachRow",
  //   })
  // }

};

export default clickHouseRepo;
