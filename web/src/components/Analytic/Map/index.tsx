import { Layout, theme, Row, Col } from "antd";
import HighcharMap from "@/components/Charts/Map";
import { useQuery } from "@tanstack/react-query";
import AnalysisApi from "@/network/analysis";
import { useMemo } from "react";
import { provinceAnalysisMap } from "@/const/province";
import { useSelector } from "react-redux";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { removeNullishAttributes } from "@/helpers/job.helper";

const MapAnalysis = () => {
  const filter = useSelector(selectFilter);
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchMapData", filter],
    queryFn: async () => {
      let configParams = {};
      configParams = removeNullishAttributes(filter) as any;
      const responseData = await AnalysisApi.getMap({ params: configParams });
      if (responseData?.data?.length) {
        return responseData.data;
      } else {
        return null;
      }
    },
  });

  const countJobData = useMemo(
    () =>
      dataQuery
        ? dataQuery.map((val: any) => {
            let title: string = provinceAnalysisMap.get(val.province) || "";
            return [title, parseInt(val.count)];
          })
        : [],
    [dataQuery]
  );

  const averageSalaryData = useMemo(
    () =>
      dataQuery
        ? dataQuery.map((val: any) => {
            let title: string = provinceAnalysisMap.get(val.province) || "";
            return [title, parseFloat(val.average)];
          })
        : [],
    [dataQuery]
  );

  return (
    <Layout
      title=""
      style={{ backgroundColor: colorBgLayout, paddingBottom: "2em" }}
    >
      <Layout.Header style={{ backgroundColor: "white", borderTop: "2px" }}>
        Các công việc được hiển thị theo bản đồ Việt Nam.
      </Layout.Header>
      <Layout.Content>
        {/* <Flex
          justify="space-around"
          align="center"
          style={{ marginTop: "1em", marginBottom: "1em" }}
        > */}
        <Row
          style={{ marginTop: "1em", marginBottom: "1em" }}
          justify="space-evenly"
        >
          <Col span={11}>
            <HighcharMap
              title={"Thống kê Số lượng công việc theo địa điểm"}
              subtitle={""}
              data={countJobData}
              colorMin={"#21ed4d"}
              colorMax={"#0a4012"}
              maxValue={100}
              minValue={0}
              loading={isLoading}
              yTitle="Số lượng công việc"
            />
          </Col>
          <Col span={11}>
            <HighcharMap
              title={"Phân phối mức lương trung bình công việc theo địa điểm"}
              subtitle={""}
              data={averageSalaryData}
              colorMin={"#dece1b"}
              colorMax={"#cc0808"}
              maxValue={30}
              minValue={5}
              loading={isLoading}
              yTitle="Mức lương"
            />
          </Col>
          <Col span={10}></Col>
        </Row>
        {/* </Flex> */}
      </Layout.Content>
    </Layout>
  );
};

export default MapAnalysis;
