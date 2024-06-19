import fs from "fs";
import client from "../models/clickhouse.js";
import { logger } from "../utils/logger.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createString = `CREATE TABLE IF NOT EXISTS thesis.jobs (
    _id String,
    age Tuple (
        type UInt8,
        min Nullable(UInt8),
        max Nullable(UInt8),
        fixed Nullable(UInt8)
    ),
    benefit Array(String),
    category Array(String),
    certificate UInt8,
    company String,
    description Array(String),
    experience Tuple (
        type UInt8,
        min Nullable(UInt8),
        max Nullable(UInt8),
        fixed Nullable(UInt8)
    ),
    expiration DateTime,
    location Array( Tuple(
        province LowCardinality(String),
        district String,
        address String
    )),
    logo String,
    requirement Array(String),
    role UInt8,
    salary Tuple (
        type UInt8,
        min Nullable(Float32),
        max Nullable(Float32),
        fixed Nullable(Float32)
    ),
    sex UInt8,
    title String,
    type Array(UInt8),
    update_time DateTime,
    url String,
    field Array(String)
) ENGINE = MergeTree()
ORDER BY _id;`;

// clickHouseClient

export default async () => {
  try {
    // await client.command({
    //   query: createString,
    //   clickhouse_settings: {
    //     wait_end_of_query: 1,
    //   },
    // });
    // const filePath = path.resolve(__dirname, "../../data/jobs.json");
    // let rawdata = fs.readFileSync(filePath, "utf8");
    // let parseData = JSON.parse(rawdata);

    // if (parseData.length) {
    //   await client.command({
    //     query: "TRUNCATE TABLE thesis.jobs",
    //   });
    // }
    // try {
    //   await client.insert({
    //     table: "jobs",
    //     values: parseData,
    //     format: "JSON",
    //   });
    //   console.log("Insert " + parseData.length + " jobs sucess");
    // } catch (e) {
    //   console.log("Error when insert data to clickhouse", e);
    // }

    // const example = await client.query({
    //     query: `SELECT * from thesis.jobs WHERE _id = '666b0a9fabdeafc3478125cf'`,
    //     format: 'JSONEachRow',
    // })
    // let final = await example.json()
    // console.log(final[0].location)
  } catch (e) {
    console.log(e);
    logger.error(
      import.meta.url,
      "APP",
      "Error run init clickhouse: ",
      e.message
    );
  }
};
