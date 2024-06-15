import { Layout, Breadcrumb, theme } from "antd";
import { useEffect, useState } from "react";
import LineChart from "@/components/Charts/LineChart";

const LineAnalysis = () => {
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const [lineData, setLineData] = useState([])

  async function fetchData() {
    const res = await fetch(import.meta.env.VITE_API_URL+ '/api/analysis/line');

    if(res.status === 200){
      const result: any = await res.json();
      setLineData(result.data);
    }
    
  } 

  useEffect(()=> {
    fetchData();
  }, []);

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
          <Breadcrumb.Item>Line chart</Breadcrumb.Item>
          <h2>Heaher ne</h2>
        </Breadcrumb>
      </Layout.Header>
      <Layout.Content>
        <LineChart title="Line chart" align="center" subtitle="Subtitle of line chart" data={lineData}/>
      </Layout.Content>
    </Layout>
  );
};

export default LineAnalysis;
