import {
  Alert,
  Breadcrumb,
  Col,
  Flex,
  Layout,
  Pagination,
  Row,
  Select,
  Spin,
  Empty,
  theme,
} from "antd";
import JobCard from "./JobCard";
import Search from "./Search";
import Filter from "./Filter";
import { useCallback, useEffect, useState } from "react";
import { defaultFilter } from "@/const/options";

export default function JobTable() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalCount: 0,
  });

  const [filter, setFilter] = useState(defaultFilter);
  const [order, setOrder] = useState("lastest");

  const handleChangePage = useCallback(
    (val: number) => {
      setPagination({ ...pagination, currentPage: val });
    },
    [pagination]
  );

  const handleChangeOrder = useCallback((val: string)=> {
    setOrder(val);
  }, []);

  const typedKeys = <T extends object>(obj: T): (keyof T)[] => {
    return Object.keys(obj) as (keyof T)[];
  };

  async function getJobData(clickSearch = false) {
    setLoading(true);
    try {
      let filterString: string[] = [];
      typedKeys(filter).map((val) => {
        if (val === "text") {
          if (filter[val] !== ""){
            filterString.push(val.toString() + "=" + filter[val]);
          }
        } else if (val === "province") {
          if (filter[val] !== "all") {
            filterString.push(val.toString() + "=" + filter[val]);
          }
        } else if(filter[val] != null || filter[val] != undefined) {
          filterString.push(val.toString() + "=" + filter[val]);
        }
      });
      let params = "";
      if (filterString.length > 0) {
        params = '&'+ filterString.join("&");
      }

      const jobs = await fetch(
        `http://localhost:3003/api?page=${clickSearch ? 1 : pagination.currentPage}&order=${order}${params}`
      );

      const jobData = await jobs.json();
      if (jobData && jobs.status === 200) {
        setData(jobData.data.jobs);
        setPagination({
          currentPage: jobData.data.currentPage,
          totalPage: jobData.data.totalPage,
          totalCount: jobData.data.totalCount,
        });
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    getJobData();
  }, [pagination.currentPage, order]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout.Sider width={"15vw"} style={{ background: "white" }}>
        <Layout.Header />
        <Filter filter={filter} setData={setFilter} />
      </Layout.Sider>
      <Layout>
        <Layout.Header>
          <Search filter={filter} setFilter={setFilter} getJobData={getJobData} loading={loading}/>
        </Layout.Header>
        <Layout.Content style={{ margin: "0 16px" }}>
          <Flex align="flex-start" justify="space-between">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Jobs</Breadcrumb.Item>
              <Breadcrumb.Item>
                Showing {data.length}/{pagination.totalCount} jobs
              </Breadcrumb.Item>
            </Breadcrumb>
            <Flex
              style={{ marginTop: "1em", marginRight: "2em" }}
              align="center"
              justify="space-between"
              gap="small"
            >
              <p>Sort by </p>
              <Select
                defaultValue="lastest"
                options={[
                  { value: "lastest", label: "Lastest " },
                  { value: "fit", label: "Relevant" },
                  { value: "salary", label: "Salary" },
                ]}
                onChange={handleChangeOrder}
                value={order}
              />
            </Flex>
          </Flex>
          {loading ? (
            <Spin tip="Loading...">
              <Alert
                message="Fetching data"
                description="This may takes several second. Calm down!"
                type="info"
                // style={{ display:"flex", alignContent: "center" }}
              />
            </Spin>
          ) : data.length ? (
            <div
              style={{
                padding: 24,
                // minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Row gutter={16}>
                {data.map((job: any) => {
                  return (
                    <Col key={job._id} span={6} className="mb-4">
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
                  total={pagination.totalPage * 10}
                />
              </div>
            </div>
          ) : (
            <Empty style={{ marginTop: "4em" }} />
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
