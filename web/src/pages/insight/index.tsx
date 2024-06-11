import HighcharMap from "@/components/Charts/Map";
import PieChart from "@/components/Charts/PieChart";
import { Layout, Breadcrumb, Flex } from "antd";

export default function Insigh() {
  const pieData = [
    {
      name: "Water",
      y: 55.02,
    },
    {
      name: "Fat",
      sliced: true,
      selected: true,
      y: 26.71,
    },
    {
      name: "Carbohydrates",
      y: 1.09,
    },
    {
      name: "Protein",
      y: 15.5,
    },
    {
      name: "Ash",
      y: 1.68,
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
            <Flex
              justify="space-around"
              align="center"
              style={{ marginTop: "1em", marginBottom: "1em" }}
            >
              <HighcharMap
                title={"Thống kê Số lượng công việc theo địa điểm"}
              />
              <HighcharMap
                title={"Phân phối mức lương trung bình công việc theo địa điểm"}
              />
            </Flex>
            <PieChart title="Pie chart ne hihi" data={pieData} subtitle="Hehe" />
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout.Content>
  );
}
