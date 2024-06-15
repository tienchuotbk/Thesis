import { Layout, Flex, theme } from "antd";
import { useEffect, useState } from "react";
import HighcharMap from "@/components/Charts/Map";

const MapAnalysis = () => {
  const {
    token: { colorBgBase, colorBgLayout },
  } = theme.useToken();
  return (
    <Layout
      title="Abcsd"
      style={{ backgroundColor: colorBgLayout, paddingBottom: "2em" }}
    >
      <Layout.Header style={{ backgroundColor: "white", borderTop: "2px" }}>
        <h2>Heaher ne</h2>
      </Layout.Header>
      <Layout.Content>
        <Flex
          justify="space-around"
          align="center"
          style={{ marginTop: "1em", marginBottom: "1em" }}
        >
          <HighcharMap title={"Thống kê Số lượng công việc theo địa điểm"}/>
          <HighcharMap
            title={"Phân phối mức lương trung bình công việc theo địa điểm"}
          />
        </Flex>
      </Layout.Content>
    </Layout>
  );
};

export default MapAnalysis;
