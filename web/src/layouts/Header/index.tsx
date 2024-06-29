import { Col, Layout, Row, Typography } from "antd";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderLogo from "../../components/Common/HeaderLogo";

type Navbar = {
  title: string;
  href: string;
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const className = useMemo(() => {
    let classes = "bg-[#f5f5f5] border-b-[1px] border-[#d9d9d9]";
    if (location.pathname.includes("/job/")) {
      classes += " !z-[2]";
    }

    return classes;
  }, [location.pathname]);

  const navbars: Navbar[] = [
    {
      title: "Trang chủ",
      href: "/",
    },
    // {
    //   title: "Công ty",
    //   href: "/company",
    // },
    {
      title: "Phân tích",
      href: "/insight",
    },
  ];

  const handleNavbarClick = useCallback((href: string) => {
    navigate(href);
  }, []);

  return (
    <Layout.Header
      className={className}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 2,
        width: "100%",
        backgroundColor: "#020433",
      }}
    >
      <div className="container mx-auto">
        <Row>
          <Col span={12} className="flex items-center">
            <HeaderLogo onClick={() => navigate("/")} />
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
          <Col span={12}>Job</Col>
        </Row>
      </div>
    </Layout.Header>
  );
}
