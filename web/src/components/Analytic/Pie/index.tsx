import { Layout, Col, Row, Breadcrumb, theme, Spin } from "antd";
import PieChart from "@/components/Charts/PieChart";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AnalysisApi from "@/network/analysis";
import { certificateMap, sexMap, typeMap } from "@/const";
import { useSelector } from "react-redux";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { removeNullishAttributes } from "@/helpers/job.helper";

const PieAnalysis = () => {
  const filter = useSelector(selectFilter);
  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchPieData", filter],
    queryFn: async () => {
      let configParams = {};
      configParams = removeNullishAttributes(filter) as any;
      const responseData = await AnalysisApi.getPie({ params: filter });
      if (responseData?.data) {
        return responseData.data;
      } else {
        return null;
      }
    },
  });

  const ageData = useMemo(() => {
    return dataQuery?.sex?.map((val: any) => ({
      name: sexMap.get(val.value),
      y: val.percentage,
    }));
  }, [dataQuery]);

  const typeData = useMemo(() => {
    return dataQuery?.type?.map((val: any) => ({
      name: typeMap.get(val.value),
      y: val.percentage,
    }));
  }, [dataQuery]);

  const certificateData = useMemo(() => {
    return dataQuery?.certificate?.map((val: any) => ({
      name: certificateMap.get(val.value),
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
            {!isLoading ? (
              <PieChart title="Pie chart 1" data={ageData} subtitle="Subtitle of pie chart 1" />
            ) : (
              <Spin tip="Loading" size="large"></Spin>
            )}
            <div className="text-center bg-current"></div>
          </Col>
          <Col span={2} />
          <Col span={10}>
            {!isLoading ? (
              <PieChart title="Type data" data={typeData} subtitle="ubtitle of pie chart 2" />
            ) : (
              <Spin tip="Loading" size="large"></Spin>
            )}
          </Col>
          <Col span={1} />
        </Row>
        <Row style={{ marginTop: "1em", marginBottom: "1em" }}>
          <Col span={12} offset={6}>
            {!isLoading ? (
              certificateData.length ? (
                <PieChart
                  title="Certificate data"
                  data={certificateData}
                  subtitle="ubtitle of pie chart 2"
                />
              ) : null
            ) : (
              <Spin tip="Loading" size="large"></Spin>
            )}
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default PieAnalysis;
