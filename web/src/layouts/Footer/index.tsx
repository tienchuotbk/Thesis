import { Layout } from "antd";

export default function Footer() {
  return (
    <Layout.Footer className="text-center border-t-[1px] border-[#d9d9d9]">
      Job Search System ©{new Date().getFullYear()} Created by ChuotGreen
    </Layout.Footer>
  );
}
