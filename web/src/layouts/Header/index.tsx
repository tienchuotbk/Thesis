import { Col, Layout, Row, Typography } from "antd";
import HeaderLogo from "../../components/Common/HeaderLogo";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

type Navbar = {
  title: string;
  href: string;
};
export default function Header() {
  const navigate = useNavigate();
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

  const handleNavbarClick = useCallback((href: string) => {
    navigate(href);
  }, []);

  return (
    <Layout.Header className="bg-[#f5f5f5] border-b-2 border-[#d9d9d9]">
      <div className="container mx-auto">
        <Row>
          <Col span={12} className="flex items-center">
            <HeaderLogo />
            {navbars.map((navbar: Navbar, index: number) => {
              return (
                <Typography.Link
                  key={index}
                  className="mr-8 font-bold text-base user select-none"
                  onClick={() => handleNavbarClick(navbar.href)}
                >
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
