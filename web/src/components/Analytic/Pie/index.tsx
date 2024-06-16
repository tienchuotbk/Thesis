import { Layout, Col, Row, Breadcrumb, theme } from "antd";
import PieChart from "@/components/Charts/PieChart";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AnalysisApi from "@/network/analysis";

const PieAnalysis = () => {
  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchPieData"],
    queryFn: async () => {
      const configParams = {};
      const responseData = await AnalysisApi.getPie({ params: configParams });
      if (responseData?.data) {
        return responseData.data;
      } else {
        return null;
      }
    },
  });

  const ageData = useMemo(() => {
    return dataQuery?.sex.map((val: any) => ({
      name: val.value,
      y: val.percentage,
    }));
  }, [dataQuery]);

  const typeData = useMemo(() => {
    return dataQuery?.type.map((val: any) => ({
      name: val.value,
      y: val.percentage,
    }));
  }, [dataQuery]);

  const certificateData = useMemo(() => {
    return dataQuery?.certificate.map((val: any) => ({
      name: val.value,
      y: val.percentage,
    }));
  }, [dataQuery]);

  const {
    token: { colorBgBase },
  } = theme.useToken();

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
              data={ageData}
              subtitle="Subtitle of pie chart 1"
            />
            <div className="text-center bg-current">
              Description of pie chart 1 with details
            </div>
          </Col>
          <Col span={2} />
          <Col span={10}>
            <PieChart
              title="Type data"
              data={typeData}
              subtitle="ubtitle of pie chart 2"
            />
          </Col>
          <Col span={1} />
          <Col span={10}>
            <PieChart
              title="Certificate data"
              data={certificateData}
              subtitle="ubtitle of pie chart 2"
            />
          </Col>
          <Col span={1} />
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default PieAnalysis;
