import { Layout, Col, Row, Breadcrumb, theme } from "antd";
import PieChart from "@/components/Charts/PieChart";
import { useEffect, useState } from "react";
import TableChart from "@/components/Charts/Table";

const TableAnalysis = () => {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  return (
    <Layout
      title="Table Chart"
      // style={{ backgroundColor: colorBgLayout, paddingBottom: "2em" }}
    >
      <Layout.Header
        style={{
          backgroundColor: colorBgBase,
          borderTop: "2px",
          padding: "0.5em",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>Job Visualization</Breadcrumb.Item>
          <Breadcrumb.Item>table chart</Breadcrumb.Item>
          <h2>Heaher ne</h2>
        </Breadcrumb>
      </Layout.Header>
      <Layout.Content>
        <TableChart title="Hello" data={[""]} subtitle="Hihi" align="center" />
      </Layout.Content>
    </Layout>
  );
};
export default TableAnalysis;
