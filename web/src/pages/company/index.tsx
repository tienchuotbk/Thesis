import CarouselJob from "@/components/CarouselJob";
import CompanyApi from "@/network/company";
import { useQuery } from "@tanstack/react-query";
import { Alert, Empty, Layout, Spin, Typography } from "antd";

export default function Company() {
  const { isPending, data } = useQuery({
    queryKey: ["company-analytics"],
    queryFn: async () => {
      const res = await CompanyApi.analytics();
      if (res.data) {
        return res.data;
      }
    },
  });

  return (
    <Layout.Content className="container mx-auto pt-4 min-h-[800px]">
      {isPending && (
        <Spin tip="Đang tải...">
          <Alert
            message="Đang tải dữ liệu"
            description="Việc này có thể mất vài giây. Bình tĩnh!"
            type="info"
          />
        </Spin>
      )}
      {!isPending && !data && <Empty description="Không có dữ liệu" />}
      {data && (
        <>
          <Typography.Text className="text-[18px] font-bold my-4 block">
            Top 10 công ty đăng tuyển nhiều việc làm nhất.
          </Typography.Text>
          <CarouselJob companies={data.top_10}></CarouselJob>
        </>
      )}
    </Layout.Content>
  );
}
