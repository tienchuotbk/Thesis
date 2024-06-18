import { Layout, Breadcrumb, theme } from "antd";
import { useEffect, useMemo, useState } from "react";
import LineChart from "@/components/Charts/LineChart";
import { useQuery } from "@tanstack/react-query";
import AnalysisApi from "@/network/analysis";
import { useSelector } from "react-redux";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { removeNullishAttributes } from "@/helpers/job.helper";


const LineAnalysis = () => {
  const filter = useSelector(selectFilter);
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchLineData", filter],
    queryFn: async () => {
      let configParams = {};
      configParams = removeNullishAttributes(filter) as any;
      const responseData = await AnalysisApi.getLine({ params: configParams });
      if (responseData?.data) {
        return responseData.data;
      } else {
        return null;
      }
    },
  });

  console.log(dataQuery);

  const ageData = useMemo(() => {
    return dataQuery ? dataQuery.age : [];
  }, [dataQuery]);

  const salaryData = useMemo(() => {
    return dataQuery ? dataQuery.salary : [];
  }, [dataQuery]);

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
        <LineChart
          title="Số lượng công việc phân bố theo độ tuổi"
          align="center"
          subtitle="Dữ liệu số lượng công việc tính theo độ tuổi từ 16 đến 60"
          yTitle="Số lượng công việc"
          series={[{ name: "Số lượng công việc", data: ageData }]}
          start={16}
          interval={1}
          xTitle={"Độ tuổi"}
        />
        <LineChart
          title="Số lượng công việc phân bổ theo mức lương"
          align="center"
          subtitle="Dữ liệu mức lương tính theo đơn vị triệu VND"
          series={[{ name: "Số lượng công việc", data: salaryData }]}
          yTitle="Số lượng công việc"
          start={1}
          interval={1}
          xTitle={"Mức lương hiển thị"}
        />
      </Layout.Content>
    </Layout>
  );
};

export default LineAnalysis;
