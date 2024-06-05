import {
  Breadcrumb,
  Col,
  Flex,
  Layout,
  Menu,
  Row,
  Select,
  Typography,
  theme,
} from "antd";
import JobCard from "./JobCard";
import Search from "./Search";
import Filter from "./Filter";
import type { MenuProps } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

// type Data = {
//   _id: number;
//   title: string;
//   location: string;
//   salary: object;
// };
const data = [
  {
    salary: {
      type: 1,
      min: 10,
      max: 30,
    },
    _id: "665899d539a38473d0681ad2",
    category: [
      "Bán hàng - Kinh doanh",
      "Chăm sóc khách hàng",
      "Nghề nghiệp khác",
    ],
    company: "Công Ty Tài Chính TNHH Ngân Hàng Việt Nam Thịnh Vượng SMBC",
    title: "Nhân Viên Tư Vấn Tại Văn Phòng Quận Tân Bình Thu Nhập 10-30Tr",
    update_time: "2024-05-23T00:00:00.000Z",
    url: "https://vieclam24h.vn/ban-hang-kinh-doanh/nhan-vien-tu-van-tai-van-phong-quan-tan-binh-thu-nhap-10-30tr-c13p122id200353426.html?open_from=0201_1_1&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 7,
      max: 15,
    },
    _id: "665899d639a38473d0681ad3",
    category: [
      "Bán hàng - Kinh doanh",
      "Bán sỉ - Bán lẻ - Quản lý cửa hàng",
      "Sản xuất - Lắp ráp - Chế biến",
    ],
    company: "Công Ty TNHH Ntpm Việt Nam",
    title: "Nhân Viên Kinh Doanh",
    update_time: "2024-05-08T00:00:00.000Z",
    url: "https://vieclam24h.vn/ban-hang-kinh-doanh/nhan-vien-kinh-doanh-c13p122id200345346.html?open_from=0201_1_2&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 8,
      max: 15,
    },
    _id: "665899d639a38473d0681ad4",
    category: [
      "Chăm sóc khách hàng",
      "Hành chính - Thư ký",
      "Bán hàng - Kinh doanh",
    ],
    company: "Công Ty TNHH TM DV Liên Minh Quốc Tế Diamond-G",
    title: "Nhân Viên Tư Vấn Tại Văn Phòng Lương 15 Triệu",
    update_time: "2024-05-23T00:00:00.000Z",
    url: "https://vieclam24h.vn/cham-soc-khach-hang/nhan-vien-tu-van-tai-van-phong-luong-15-trieu-c30p122id200351884.html?open_from=0201_1_3&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 6,
      max: 8,
    },
    _id: "665899d639a38473d0681ad5",
    category: [
      "An ninh - Bảo vệ",
      "Vận Tải - Lái xe - Giao nhận",
      "Lao động phổ thông",
    ],
    company: "Công Ty Cổ Phần Quốc Tế Anh Văn Hội Việt Mỹ",
    title: "[HCM, Bình Dương] Nhân Viên Bảo Vệ Nội Bộ",
    update_time: "2024-05-28T00:00:00.000Z",
    url: "https://vieclam24h.vn/an-ninh-bao-ve/hcm-binh-duong-nhan-vien-bao-ve-noi-bo-c2p119id200355367.html?open_from=0201_1_4&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 9,
      max: 10,
    },
    _id: "665899d639a38473d0681ad6",
    category: [
      "Kế toán",
      "Phân tích - Thống kê dữ liệu",
      "Thu mua - Kho Vận - Chuỗi cung ứng",
    ],
    company: "Công Ty TNHH Thương Mại Kav",
    title: "Kế Toán Nội Bộ Quận Hà Đông Đi Làm Ngay",
    update_time: "2024-05-23T00:00:00.000Z",
    url: "https://vieclam24h.vn/ke-toan/ke-toan-noi-bo-quan-ha-dong-di-lam-ngay-c17p73id200353641.html?open_from=0201_1_5&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 10,
      max: 20,
    },
    _id: "665899d639a38473d0681ad7",
    category: [
      "Bán hàng - Kinh doanh",
      "Thông tin - Truyền thông - Quảng cáo",
      "Xuất bản - In ấn",
    ],
    company: "CÔNG TY CỔ PHẦN TRUYỀN THÔNG VÀ CÔNG NGHỆ ĐẠI VIỆT ",
    title: "Nhân Viên Kinh Doanh",
    update_time: "2024-05-22T00:00:00.000Z",
    url: "https://vieclam24h.vn/ban-hang-kinh-doanh/nhan-vien-kinh-doanh-c13p122id200352569.html?open_from=0201_1_6&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 7,
      max: 10,
    },
    _id: "665899d639a38473d0681ad8",
    category: [
      "Khách sạn - Nhà hàng - Du lịch",
      "Chăm sóc khách hàng",
      "Nghề nghiệp khác",
    ],
    company: "Công Ty Cổ Phần Phục Vụ Mặt Đất Sài Gòn - Cam Ranh",
    title: "Nhân Viên Phục Vụ Hành Khách",
    update_time: "2024-05-21T00:00:00.000Z",
    url: "https://vieclam24h.vn/khach-san-nha-hang-du-lich/nhan-vien-phuc-vu-hanh-khach-c5p109id200351729.html?open_from=0201_1_7&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 15,
      max: 25,
    },
    _id: "665899d639a38473d0681ad9",
    category: [
      "Bán hàng - Kinh doanh",
      "Chăm sóc khách hàng",
      "Bán sỉ - Bán lẻ - Quản lý cửa hàng",
    ],
    company: "Công Ty TNHH Careline Solution",
    title:
      "Quận 1 - Nhân Viên Tư Vấn Chốt Đơn / Telesale / Call Center Kinh Nghiệm Trên 3 Tháng (Thu Nhập 15 - 25 Triệu)",
    update_time: "2024-05-16T00:00:00.000Z",
    url: "https://vieclam24h.vn/ban-hang-kinh-doanh/quan-1-nhan-vien-tu-van-chot-don-telesale-call-center-kinh-nghiem-tren-3-thang-thu-nhap-15-25-trieu-c13p122id200350684.html?open_from=0201_1_8&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 12,
      max: 15,
    },
    _id: "665899d639a38473d0681ada",
    category: [
      "Bán hàng - Kinh doanh",
      "Vận Tải - Lái xe - Giao nhận",
      "Hành chính - Thư ký",
    ],
    company: "Công Ty Cổ Phần Hakago Express",
    title: "Nhân Viên Kinh Doanh Cước Phí Chuyển Phát Nhanh",
    update_time: "2024-05-18T00:00:00.000Z",
    url: "https://vieclam24h.vn/ban-hang-kinh-doanh/nhan-vien-kinh-doanh-cuoc-phi-chuyen-phat-nhanh-c13p73id200351272.html?open_from=0201_1_9&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
  {
    salary: {
      type: 1,
      min: 8,
      max: 10,
    },
    _id: "665899d639a38473d0681adb",
    category: [
      "Vận hành - Bảo trì - Bảo dưỡng",
      "Cơ khí - Ô tô - Tự động hóa",
      "Sản xuất - Lắp ráp - Chế biến",
    ],
    company: "Công Ty TNHH Oishi Industries Việt Nam",
    title: "Nhân Viên Bảo Trì Khuôn",
    update_time: "2024-05-09T00:00:00.000Z",
    url: "https://vieclam24h.vn/van-hanh-bao-tri-bao-duong/nhan-vien-bao-tri-khuon-c10p104id200310132.html?open_from=0201_1_10&search_id=b2b9641b04e30ed8d9d95cab3cdc44db",
  },
];

export default function JobTable() {
  type MenuItem = Required<MenuProps>["items"][number];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Layout.Sider width={"15vw"} style={{ background: "white" }}>
        <Layout.Header />
        <Filter />
      </Layout.Sider>
      <Layout>
        <Layout.Header>
          <Search />
        </Layout.Header>
        <Layout.Content style={{ margin: "0 16px" }}>
          <Flex align="flex-start" justify="space-between">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Jobs</Breadcrumb.Item>
              <Breadcrumb.Item>Showing 5/5 jobs</Breadcrumb.Item>
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
              />
            </Flex>
          </Flex>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={16}>
              {data.map((job) => {
                return (
                  <Col key={job._id} span={6} className="mb-4">
                    <JobCard jobInfo={job} />
                  </Col>
                );
              })}
            </Row>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
