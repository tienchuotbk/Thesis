import JobDetail from "@/components/JobDetail";
import { Layout } from "antd";

export default function Job() {
  return (
    <Layout.Content className="container min-w-[100vw] mb-8">
      <JobDetail />
    </Layout.Content>
  );
}
