import { Col, Layout, Row, Typography } from "antd";
import HeaderLogo from "../../components/Common/HeaderLogo";

type Navbar = {
  title: string;
  href: string;
};
export default function Header() {
  const navbars: Navbar[] = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Job Offer",
      href: "/job-offer",
    },
  ];
  return (
    <Layout.Header className="bg-[#f5f5f5]">
      <div className="container mx-auto">
        <Row>
          <Col span={12} className="flex items-center">
            <HeaderLogo />
            {navbars.map((navbar, index) => {
              return (
                <Typography.Link key={index} className="mr-8 font-bold text-base">
                  {navbar.title}
                </Typography.Link>
              );
            })}
          </Col>
          <Col span={12}>2</Col>
        </Row>
      </div>
    </Layout.Header>
  );
}
