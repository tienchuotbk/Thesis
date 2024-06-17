import JobTable from "@/components/JobTable";
import { Layout } from "antd";

export default function Index() {
  return (
    <Layout.Content className="container" style={{ minWidth: "100vw" }}>
      <JobTable />
    </Layout.Content>
  );
}
