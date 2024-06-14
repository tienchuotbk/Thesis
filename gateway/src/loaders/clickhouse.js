import client from "../models/clickhouse.js";
import fs from "fs";
import { Transform } from "stream";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createString = `CREATE TABLE IF NOT EXISTS thesis.jobs (
_id String,
age Nested(
type Int,
min Int,
max Int,
fixed Int
),
benefit Array(String),
category Array(String),
certificate Int,
company String,
description Array(String),
experience Nested(
type Int,
fixed Int,
min Int,
max Int
),
expiration DateTime,
location Nested(
province String,
district String,
address String
),
logo String,
requirement Array(String),
role Int,
salary Nested(
type Int,
min Int,
max Int
),
sex Int,
title String,
type Array(Int),
update_time DateTime,
url String,
field Array(String)
) ENGINE = MergeTree()
ORDER BY (_id);`;

// clickHouseClient

export default async () => {
  try {
    await client.command({
      query: createString,
      // Recommended for cluster usage to avoid situations where a query processing error occurred after the response code,
      // and HTTP headers were already sent to the client.
      // See https://clickhouse.com/docs/en/interfaces/http/#response-buffering
      clickhouse_settings: {
        wait_end_of_query: 1,
      },
    });
    const filePath = path.resolve(__dirname, "../../data/jobs.json");
    let rawdata = fs.readFileSync(filePath, "utf8");
    let parseData = JSON.parse(rawdata);

    console.log(parseData.length);
    if( parseData.length){
        await client.command({
            query: 'TRUNCATE TABLE thesis.jobs'
        });
    }
    await client.insert({
      table: "jobs",
      values: parseData,
      format: "JSON",
    });
    // const example = await client.query({
    //     query: `select * from jobs where _id = '666b0a9fabdeafc3478125cf'`,
    //     format: 'JSONEachRow',
    // })
    // let final = await example.json()
    // console.log(final)
  } catch (e) {
    console.log("Errror run init clickhouse", e);
  }
};
