import LollipopChart from "@/components/Charts/ Lollipop";
import LineChart from "@/components/Charts/LineChart";
import HighcharMap from "@/components/Charts/Map";
import PieChart from "@/components/Charts/PieChart";
import TableChart from "@/components/Charts/Table";
import { Layout, Breadcrumb, Flex, Col, Row, theme } from "antd";
import { useEffect, useState } from "react";

export default function Insigh() {
  const {
    token: { colorBgBase, colorBgLayout },
  } = theme.useToken();

  const [lineData, setLineData] = useState([])

  async function fetchData() {
    const res = await fetch(import.meta.env.VITE_API_URL+ '/api/analysis/line');

    if(res.status === 200){
      const result: any = await res.json();
      setLineData(result.data);
    }
    
  } 

  console.log(lineData)

  useEffect(()=> {
    fetchData();
  }, []);
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
          <Layout.Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              width: "100%",
            }}
          />
          HIc hic
        </Layout.Sider>
        <Layout>
          <Layout.Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              width: "100%",
            }}
          >
            Hihi
          </Layout.Header>
          <Layout.Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Tất cả việc làm</Breadcrumb.Item>
              <Breadcrumb.Item>Visualization</Breadcrumb.Item>
            </Breadcrumb>
            <Layout
              title="Abcsd"
              style={{ backgroundColor: colorBgLayout, paddingBottom: "2em" }}
            >
              <Layout.Header
                style={{ backgroundColor: "white", borderTop: "2px" }}
              >
                <h2>Heaher ne</h2>
              </Layout.Header>
              <Layout.Content>
                <Flex
                  justify="space-around"
                  align="center"
                  style={{ marginTop: "1em", marginBottom: "1em" }}
                >
                  <HighcharMap
                    title={"Thống kê Số lượng công việc theo địa điểm"}
                  />
                  <HighcharMap
                    title={
                      "Phân phối mức lương trung bình công việc theo địa điểm"
                    }
                  />
                </Flex>
              </Layout.Content>
            </Layout>
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
            <Layout title="Abcsd">
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
                <TableChart title="Hello" data={[""]} subtitle="Hihi" align="center"/>
                {/* <TableChart title="Hello" data={[""]} subtitle="Hihi" align="center"/>
                <TableChart title="Hello" data={[""]} subtitle="Hihi" align="center"/> */}
                <LineChart title="Line chart" align="center" subtitle="Subtitle of line chart" data={lineData}/>
                {/* <LollipopChart title="Top 10 job trending" subtitle="Subtitle trending job" data={[]} yTitle={"Y title"} /> */}
              </Layout.Content>
            </Layout>
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout.Content>
  );
}
