import LineAnalysis from "@/components/Analytic/Line";
import MapAnalysis from "@/components/Analytic/Map";
import PieAnalysis from "@/components/Analytic/Pie";
import TableAnalysis from "@/components/Analytic/Table";
import AnalysisFilter from "@/components/Charts/Filter";
import { Layout, Breadcrumb } from "antd";
import { useState } from "react";

export default function Insigh() {
  const [filter, setFilter] = useState({
    exp: null,
    level: null,
    career: "",
  });

  return (
    <Layout.Content className="container" style={{ minWidth: "100vw" }}>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Layout.Sider
          width={"15vw"}
          style={{ background: "white", position: "sticky" }}
        >
          {/* <Layout.Header
            style={{
              top: 0,
              zIndex: 100,
              width: "100%",
              backgroundColor: "#02054d"
            }}
          /> */}
          <AnalysisFilter filter={filter} setData={setFilter} />
        </Layout.Sider>
        <Layout>
          {/* <Layout.Header
            style={{
              // top: 0,
              zIndex: 100,
              width: "100%",
              backgroundColor: "#02054d"
            }}
          ></Layout.Header> */}
          <Layout.Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Tất cả việc làm</Breadcrumb.Item>
              <Breadcrumb.Item>Visualization</Breadcrumb.Item>
            </Breadcrumb>
            <MapAnalysis />
            <PieAnalysis />
            <TableAnalysis />
            <LineAnalysis />
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout.Content>
  );
}
