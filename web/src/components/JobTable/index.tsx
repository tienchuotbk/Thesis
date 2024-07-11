import JobApi from "@/network/job";
import { selectFilter } from "@/redux/slice/filter.slice";
import { selectPagination, setPagination } from "@/redux/slice/pagination.slice";
import { selectUser } from "@/redux/slice/user.slice";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Breadcrumb,
  Col,
  Empty,
  Flex,
  Layout,
  Pagination,
  Row,
  Select,
  Spin,
  theme,
} from "antd";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filter from "./Filter";
import JobCard from "./JobCard";
import Search from "./Search";
import { selectOrder, setOrder } from "@/redux/slice/sort.slice";

const typedKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export default function JobTable() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();

  const pagination = useSelector(selectPagination);
  const filter = useSelector(selectFilter);
  const uid = useSelector(selectUser);
  const order = useSelector(selectOrder);

  const { isPending, data: dataQuery } = useQuery({
    queryKey: ["fetchListJob", pagination.currentPage, pagination.pageSize, filter, order],
    queryFn: async () => {
      console.log(46);
      let filtered: any = {};
      typedKeys(filter).map((val) => {
        if (val === "text" || val === "career") {
          if (filter[val] !== "") {
            filtered[val.toString()] = filter[val];
          }
        } else if (val === "province") {
          if (filter[val] !== "all") {
            filtered[val.toString()] = filter[val];
          }
        } else if (filter[val] != null || filter[val] != undefined) {
          filtered[val.toString()] = filter[val];
        }
      });

      const configParams = {
        page: pagination.currentPage,
        order: order,
        limit: pagination.pageSize,
        uid: uid,
        ...filtered,
      };
      const responseData = await JobApi.getAll({ params: configParams });

      if (responseData.data) {
        const { currentPage, totalPage, totalCount } = responseData.data;
        dispatch(
          setPagination({
            currentPage: currentPage,
            totalPage: totalPage,
            totalCount: totalCount,
          })
        );
        return responseData.data;
      }
    },
  });

  const handleChangePage = useCallback((val: number) => {
    dispatch(
      setPagination({
        currentPage: val,
      })
    );
  }, []);

  const handleChangeOrder = useCallback((val: string) => {
    dispatch(setOrder(val));
  }, []);

  const handleSearch = useCallback(() => {
    dispatch(setPagination({ currentPage: 1 }));
  }, []);

  const handlePageSizeChange = useCallback((_page: number, pageSize: number) => {
    dispatch(
      setPagination({
        pageSize: pageSize,
      })
    );
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout.Sider width={"15vw"} style={{ background: "white", position: "sticky", zIndex: 1 }}>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            backgroundColor: "#02054d",
          }}
        />

        <Filter />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            backgroundColor: "#02054d",
          }}
        >
          <Search getJobData={handleSearch} loading={isPending} />
        </Layout.Header>
        <Layout.Content className="mx-4">
          <Flex align="flex-start" justify="space-between">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Tất cả việc làm</Breadcrumb.Item>
              <Breadcrumb.Item>
                Hiển thị <strong>{dataQuery?.jobs?.length}</strong>/
                <strong>{pagination.totalCount}</strong> việc làm
              </Breadcrumb.Item>
            </Breadcrumb>
            <Flex
              style={{ marginTop: "1em", marginRight: "2em" }}
              align="center"
              justify="space-between"
              gap="small"
            >
              <p>Sắp xếp theo </p>
              <Select
                defaultValue="lastest"
                options={[
                  { value: "fit", label: "Mặc định" },
                  { value: "lastest", label: "Mới nhất" },
                  { value: "title", label: "Tên việc làm" },
                ]}
                onChange={handleChangeOrder}
                value={order.order}
                style={{ minWidth: "8rem"}}
              />
            </Flex>
          </Flex>
          {isPending ? (
            <Spin tip="Đang tải...">
              <Alert
                message="Đang tải dữ liệu"
                description="Việc này có thể mất vài giây. Bình tĩnh!"
                type="info"
              />
            </Spin>
          ) : dataQuery?.jobs.length ? (
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Row gutter={16}>
                {dataQuery?.jobs.map((job: any) => {
                  return (
                    <Col key={job._id} xs={24} sm={12} md={8} lg={6} className="mb-3 flex">
                      <JobCard jobInfo={job} />
                    </Col>
                  );
                })}
              </Row>
              <div style={{ justifyContent: "center", display: "flex" }}>
                <Pagination
                  defaultCurrent={1}
                  current={pagination.currentPage}
                  onChange={handleChangePage}
                  onShowSizeChange={handlePageSizeChange}
                  total={pagination.totalPage * 10}
                  pageSize={pagination.pageSize}
                  pageSizeOptions={[12, 24, 36]}
                />
              </div>
            </div>
          ) : (
            <Empty className="mt-[4rem]" />
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
