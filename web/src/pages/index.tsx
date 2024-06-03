import JobTable from "@/components/JobTable";
import { Layout, Typography } from "antd";

export default function Index() {
  return (
    <Layout.Content className="container mx-auto px-4">
      <Typography.Title level={2} className="capitalize font-black">
        find your dream job here
      </Typography.Title>
      <JobTable />
    </Layout.Content>
  );
}
