import { Layout } from "antd";

export default function Footer() {
  return (
    <Layout.Footer className="text-center">
      Job Search System ©{new Date().getFullYear()} Created by ChuotGreen
    </Layout.Footer>
  );
}
