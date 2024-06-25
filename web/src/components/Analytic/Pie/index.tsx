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
      let configParams: any = {};
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
    <Layout title="">
      <Layout.Header className="bg-[#fff]">
        <span className="text-base font-bold">Tỷ lệ việc làm của các yếu tố giới tính,  hình thức làm việc và yêu cầu bằng cấp chứng chỉ</span>
      </Layout.Header>
      <Layout.Content>
        <Row className="mt-4" gutter={24}>
          <Col span={12}>
            {isLoading ? (
              <Spin tip="Loading" size="large"></Spin>
            ) : (
              <PieChart title="Tỷ lệ công việc theo giới tính" data={ageData} subtitle="" />
            )}
            <div className="text-center bg-current"></div>
          </Col>
          <Col span={12}>
            {isLoading ? (
              <Spin tip="Loading" size="large"></Spin>
            ) : (
              <PieChart title="Tỷ lệ công việc theo loại hình làm việc" data={typeData} subtitle="" />
            )}
          </Col>
        </Row>
        <Row className="mt-4" gutter={24} justify={"start"}>
          <Col span={12} offset={6}>
            {!isLoading ? (
              certificateData.length ? (
                <PieChart
                  title="Tỷ lệ công việc theo yêu cầu loại chứng chỉ"
                  data={certificateData}
                  subtitle=""
                />
              ) : null
            ) : (
              <Spin tip="Loading" size="large"></Spin>
            )}
          </Col>
          <Col span={12}></Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default PieAnalysis;
