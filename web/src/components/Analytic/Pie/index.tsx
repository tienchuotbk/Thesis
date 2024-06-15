import { Layout, Col, Row, Breadcrumb, theme } from "antd";
import PieChart from "@/components/Charts/PieChart";
import { useEffect, useState } from "react";

const PieAnalysis = () => {
    const {
        token: { colorBgBase, colorBgLayout },
    } = theme.useToken();
    const pieData = [
      {
        name: "Không yêu cầu",
        y: 55,
      },
      {
        name: "Nam",
        y: 30,
      },
      {
        name: "Nữ",
        y: 15,
      },
    ];
    const pieData2 = [
      {
        name: "BAbc",
        y: 20,
      },
      {
        name: "hhds",
        y: 20,
      },
      {
        name: "Bchs",
        y: 15,
      },
      {
        name: "ncjkdhsj",
        y: 15,
      },
      {
        name: "mcksn",
        y: 15,
      },
      {
        name: "sasdas",
        y: 15,
      },
    ];

    return (
        <Layout
              title="Abcsd"
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
                  <Breadcrumb.Item>Pie chart</Breadcrumb.Item>
                  <h2>Heaher ne</h2>
                </Breadcrumb>
              </Layout.Header>
              <Layout.Content>
                <Row style={{ marginTop: "1em", marginBottom: "1em" }}>
                  <Col span={1} />
                  <Col span={10}>
                    <PieChart
                      title="Pie chart 1"
                      data={pieData}
                      subtitle="Subtitle of pie chart 1"
                    />
                    <div className="text-center bg-current">
                      Description of pie chart 1 with details
                    </div>
                  </Col>
                  <Col span={2} />
                  <Col span={10}>
                    <PieChart
                      title="Pie chart 2"
                      data={pieData2}
                      subtitle="ubtitle of pie chart 2"
                    />
                  </Col>
                  <Col span={1} />
                </Row>
              </Layout.Content>
            </Layout>
    )

}

export default PieAnalysis;