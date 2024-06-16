import { Layout, Flex, theme } from "antd";
import HighcharMap from "@/components/Charts/Map";
import { useQuery } from "@tanstack/react-query";
import AnalysisApi from "@/network/analysis";
import { useMemo } from "react";
import { provinceAnalysisMap } from "@/const/province";

const MapAnalysis = () => {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchMapData"],
    queryFn: async () => {
      const configParams = {};
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
      dataQuery?.map((val: any) => {
        let title: string = provinceAnalysisMap.get(val.province) || "";
        return [title, parseInt(val.count)];
      }),
    [dataQuery]
  );

  const averageSalaryData = useMemo(
    () =>
      dataQuery?.map((val: any) => {
        let title: string = provinceAnalysisMap.get(val.province) || "";
        return [ title, parseFloat(val.average)];
      }),
    [dataQuery]
  );

  return (
    <Layout
      title=""
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
          <HighcharMap
            title={"Thống kê Số lượng công việc theo địa điểm"}
            subtitle={""}
            data = { countJobData }
            colorMin={"#21ed4d"} 
            colorMax={"#0a4012"}
            maxValue={100}
            minValue={0}
            loading={isLoading}
          />
          <HighcharMap
            title={"Phân phối mức lương trung bình công việc theo địa điểm"}
            subtitle={"Map 2"}
            data={ averageSalaryData }
            colorMin={"#dece1b"} 
            colorMax={"#cc0808"}
            maxValue={30}
            minValue={5}
            loading={isLoading}
          />
        </Flex>
      </Layout.Content>
    </Layout>
  );
};

export default MapAnalysis;
