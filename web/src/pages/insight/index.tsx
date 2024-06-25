import AnalysisFilter from "@/components/Analytic/Filter";
import LineAnalysis from "@/components/Analytic/Line";
import MapAnalysis from "@/components/Analytic/Map";
import PieAnalysis from "@/components/Analytic/Pie";
import TableAnalysis from "@/components/Analytic/Table";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { Breadcrumb, Divider, Layout, Space } from "antd";
import { useSelector } from "react-redux";

export default function Insigh() {
  const filter = useSelector(selectFilter);

  console.log(filter);

  return (
    <Layout.Content className="container" style={{ minWidth: "100vw" }}>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Layout.Sider width={"15vw"} style={{ background: "white", position: "sticky", zIndex: 1 }}>
          <AnalysisFilter />
        </Layout.Sider>
        <Layout>
          <Layout.Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Biều đồ thống kê</Breadcrumb.Item>
            </Breadcrumb>
            <MapAnalysis />
            <Divider />
            <PieAnalysis />
            <Divider />
            <TableAnalysis />
            <Divider />
            <LineAnalysis />
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout.Content>
  );
}
