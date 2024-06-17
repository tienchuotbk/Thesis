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
  getLineSalary: async () => {
    let result = [];

    const res = await client.query({
      query: `
        WITH array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50) AS values_array
        SELECT
          value,
          countIf(salary.type = 1 AND salary.min <= value AND salary.max >= value) +
          countIf(salary.type = 2 AND salary.fixed = value) +
          countIf(salary.type = 3 AND salary.max = value) +
          countIf(salary.type = 4 AND salary.max = value) AS count
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
    const res = await client.query({
      query: `
      WITH 
          array(${provinces.map((val) => `\'${val}\'`).join(",")}) AS provinces
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

  getProportionData: async () => {
    const res = await client.query({
      query: `
        SELECT
            'sex' AS category,
            sex AS value,
            COUNT(*) AS count,
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
        FROM
            thesis.jobs
        GROUP BY
            sex

        UNION ALL

        SELECT
            'certificate' AS category,
            certificate AS value,
            COUNT(*) AS count,
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
        FROM
            thesis.jobs
        GROUP BY
            certificate

        UNION ALL

        SELECT
            'type' AS category,
            type_value AS value,
            COUNT(*) AS count,
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
        FROM
            (SELECT arrayJoin(type) AS type_value FROM thesis.jobs)
        GROUP BY
            type_value
        ORDER BY
            category, value;`,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },
  getTableRoleData: async () => {
    const res = await client.query({
      query: `
        SELECT 
            role, COUNT(role) as count
        FROM thesis.jobs
        GROUP BY role
      `,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },
  getTableExperienceData: async () => {
    const res = await client.query({
      query: `
        SELECT 
            SUM(CASE WHEN experience.type = 0 THEN 1 ELSE 0 END) AS none,
            SUM(CASE WHEN experience.max = 1 THEN 1 ELSE 0 END) AS under_one_year,
            SUM(CASE WHEN experience.fixed = 1 OR experience.min = 1 THEN 1 ELSE 0 END) AS one_year,
            SUM(CASE WHEN experience.fixed = 2 OR experience.min = 2 THEN 1 ELSE 0 END) AS two_years,
            SUM(CASE WHEN experience.fixed = 3 OR experience.min = 3 THEN 1 ELSE 0 END) AS three_years,
            SUM(CASE WHEN experience.fixed = 4 OR experience.min = 4 THEN 1 ELSE 0 END) AS four_years,
            SUM(CASE WHEN experience.fixed = 5 OR experience.min = 5 THEN 1 ELSE 0 END) AS from_five_years
        FROM 
            thesis.jobs;
      `,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },
  getNumAndSalaryByField: async () => {
    const res = await client.query({
      query: `
        SELECT
            field_name,
            COUNT(*) AS count,
            AVG(
                CASE
                    WHEN salary.type = 1 THEN (salary.min + salary.max) / 2
                    WHEN salary.type = 2 THEN salary.fixed
                    WHEN salary.type = 3 THEN salary.max
                    WHEN salary.type = 4 THEN salary.min
                    ELSE NULL
                END
            ) AS average_salary
        FROM
        (
            SELECT arrayJoin(field) AS field_name, salary
            FROM thesis.jobs
        )
        GROUP BY field_name;
        `,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },
  getSalaryByField: async () => {
    const res = await client.query({
      query: `
        SELECT
            field_value,
            AVG()
        FROM
        (
            SELECT arrayJoin(field) AS field_value
            FROM thesis.jobs
        )
        GROUP BY field_value
        ORDER BY count DESC;`,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },
  getT: async () => {
    const res = await client.query({
      query: ``,
      format: "JSONEachRow",
    });
    let data = await res.json();
    return data;
  },
};

export default clickHouseRepo;
