import JobTable from "@/components/JobTable";
import { Layout } from "antd";

export default function Index() {
  return (
    <Layout.Content className="container mx-auto px-4">
      <JobTable />
    </Layout.Content>
  );
}
