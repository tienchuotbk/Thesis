import LineChart from "@/components/Charts/LineChart";
import { removeNullishAttributes } from "@/helpers/job.helper";
import AnalysisApi from "@/network/analysis";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Layout, theme } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";

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

  const ageData = useMemo(() => {
    return dataQuery ? dataQuery.age : [];
  }, [dataQuery]);

  const salaryData = useMemo(() => {
    return dataQuery ? dataQuery.salary : [];
  }, [dataQuery]);

  return (
    <Layout title="Table Chart">
      <Layout.Header className="bg-[#ffffff]">
        <span className="text-base font-bold">Phân bố số lượng công việc dựa theo độ tuổi và mức lương</span>
      </Layout.Header>
      <Layout.Content className="my-[1rem]">
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
        <div className="mb-2"></div>
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
