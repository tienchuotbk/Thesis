import { createClient } from "@clickhouse/client";
const clickHouseClient = createClient({
  url: "http://localhost:8123",
  database: "thesis",
  username: "admin",
  password: '20194856'
});
export default clickHouseClient;