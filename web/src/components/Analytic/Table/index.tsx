import TableChart from "@/components/Charts/Table";
import { experienceMap, fieldsMap, rolesMap } from "@/const";
import { removeNullishAttributes } from "@/helpers/job.helper";
import AnalysisApi from "@/network/analysis";
import { selectFilter } from "@/redux/slice/analysisFilter.slice";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Layout, theme } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const TableAnalysis = () => {
  const filter = useSelector(selectFilter);
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const { isLoading, data: dataQuery } = useQuery({
    queryKey: ["fetchTableData", filter],
    queryFn: async () => {
      let configParams = {};
      configParams = removeNullishAttributes(filter) as any;
      const responseData = await AnalysisApi.getTable({ params: configParams });
      if (responseData?.data) {
        return responseData.data;
      } else {
        return null;
      }
    },
  });

  const salaryByFieldData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    dataQuery?.field_count_salary?.map((val: any) => {
      arrTitle.push(fieldsMap.get(val.field_name) || "");
      arrValue.push(parseFloat(val.average_salary?.toFixed(2)));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  const roleCountData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    dataQuery?.role_count?.map((val: any) => {
      arrTitle.push(rolesMap.get(val.role) || "");
      arrValue.push(parseInt(val.count));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  const expCountData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    Object.keys(dataQuery ? dataQuery.exp_count : {}).map((val: string) => {
      arrTitle.push(experienceMap.get(val) || "");
      arrValue.push(parseInt(dataQuery?.exp_count[val]));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  const fieldCountData = useMemo(() => {
    let arrTitle: string[] = [];
    let arrValue: number[] = [];
    dataQuery?.field_count_salary?.map((val: any) => {
      arrTitle.push(fieldsMap.get(val.field_name) || "");
      arrValue.push(parseInt(val.count));
    });
    return {
      x_title: arrTitle,
      value: arrValue,
    };
  }, [dataQuery]);

  return (
    <Layout title="Table Chart">
      <Layout.Header className="bg-[#ffffff]">
        <span className="text-base font-bold">Biểu đồ cột</span>
      </Layout.Header>
      <Layout.Content className="my-[1rem]">
        <TableChart
          title="Trung bình lương theo ngành nghề"
          data={salaryByFieldData}
          subtitle=""
          description=""
          align="center"
          yText="Lương"
          valueSuffix=" Triệu"
          color={"#1af057"}
        />
        <div className="mb-2"></div>
        <TableChart
          title="Số lượng công việc theo vị trí"
          data={roleCountData}
          subtitle=""
          description=""
          align="center"
          yText="Số lượng công việc"
          valueSuffix=" việc làm"
          color={"#14e34f"}
        />
        <div className="mb-2"></div>
        <TableChart
          title="Số lượng công việc theo năm kinh nghiệm"
          data={expCountData}
          subtitle=""
          description=""
          align="center"
          yText="Số lượng công việc"
          valueSuffix=" việc làm"
          color={"#14e34f"}
        />
        <div className="mb-2"></div>
        <TableChart
          title="Tổng số công việc theo ngành nghề"
          data={fieldCountData}
          subtitle=""
          description=""
          align="center"
          yText="Số lượng công việc"
          valueSuffix=" việc làm"
          color={"#14e34f"}
        />
      </Layout.Content>
    </Layout>
  );
};
export default TableAnalysis;
