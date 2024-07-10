import HighcharMap from "@/components/Charts/Map";
import { provinceAnalysisMap, provinceMap } from "@/const/province";
import { removeNullishAttributes } from "@/helpers/job.helper";
import AnalysisApi from "@/network/analysis";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { useQuery } from "@tanstack/react-query";
import { Col, Layout, Row, theme } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import HtmlTable from "../HtmlTable";

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
        return [];
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

  const top5CountJob = useMemo(() => {
    let data = dataQuery?.sort(function (a: any, b: any) {
        return parseInt(b.count) - parseInt(a.count);
      })
      .map((val: any, index: number) => [
        index+ 1,
        provinceMap.get(val.province),
        parseInt(val.count),
      ]);
    return data?.slice(0, 5);
  }, [dataQuery]);

  const top5SalaryJob = useMemo(() => {
    let data = dataQuery?.sort(function (a: any, b: any) {
        return b.average - a.average;
      })
      .filter((val: any)=> val.province != 'other')
      .map((val: any, index: number) => [
        index +1,
        provinceMap.get(val.province),
        val.average,
      ]);
    return data?.slice(0, 5);
  }, [dataQuery]);

  return (
    <Layout
      title=""
      style={{ backgroundColor: colorBgLayout, paddingBottom: "2em" }}
    >
      <Layout.Header className="bg-[#ffffff]">
        <span className="text-base font-bold">
          Phân bố việc làm theo vị trí địa lý.
        </span>
      </Layout.Header>
      <Layout.Content>
        <Row justify="space-evenly" className="my-[1rem]" gutter={24}>
          <Col span={12}>
            <HighcharMap
              title={"Thống kê Số lượng công việc theo địa điểm"}
              subtitle={""}
              data={countJobData}
              colorMin={"#dece1b"}
              colorMax={"#cc0808"}
              maxValue={150}
              minValue={0}
              loading={isLoading}
              yTitle="Số lượng công việc"
            />
          </Col>
          <Col span={12}>
            <HighcharMap
              title={"Phân phối mức lương trung bình công việc theo địa điểm"}
              subtitle={""}
              data={averageSalaryData}
              colorMin={"#21ed4d"}
              colorMax={"#0a4012"}
              maxValue={30}
              minValue={5}
              loading={isLoading}
              yTitle="Mức lương"
            />
          </Col>
          <Col span={10}></Col>
        </Row>
        <Row justify="space-evenly" className="my-[1rem]" gutter={24}>
          <Col 
          // style={{ backgroundColor: "white", padding: "1em 3em" }}
          >
            <h2 style={{ textAlign: "center" }}>
              Top {top5CountJob?.length} tỉnh thành có số lượng tuyển dụng việc làm cao nhất
            </h2>
            <HtmlTable
              headers={["STT", "Tinh thanh", "Số lượng việc làm"]}
              values={top5CountJob}
            />
          </Col>
          <Col>
          <h2 style={{ textAlign: "center" }}>
              Top {top5SalaryJob?.length} tỉnh thành tuyển dụng với mức lương trung bình cao nhất
            </h2>
            <HtmlTable
              headers={["STT", "Tinh thanh", "Luong"]}
              values={top5SalaryJob}
            />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default MapAnalysis;
