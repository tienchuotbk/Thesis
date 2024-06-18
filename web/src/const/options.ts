export interface filterInterface {
  type: null | number;
  role: null | number;
  sex: null | number;
  exp: null | number;
  age: null | number;
  salary: undefined | number;
  level: null | number;
  career: null | string;
  text: string;
  province: string;
}
export const defaultFilter: filterInterface = {
  type: null,
  role: null,
  sex: null,
  exp: null,
  age: null,
  salary: undefined,
  level: null,
  career: "",
  text: "",
  province: "all",
};
export const typeOptions = [
  { value: null, label: "Tất cả" },
  { value: 0, label: "Toàn thời gian cố định" },
  { value: 1, label: "Thời vụ" },
  { value: 2, label: "Partime" },
  { value: 3, label: "Hợp đồng" },
  { value: 4, label: "Thực tập" },
  { value: 5, label: "Khác" },
];
export const careerOptions = [
  { value: "", label: "Tất cả ngành nghề" },
  { value: "hc_ql", label: "Hành chính - Quản lý" },
  { value: "gd_dt", label: "Giáo dục - Đào tạo" },
  { value: "nn_ln_ts", label: "Nông nghiệp - Lâm nghiệp - Thủy sản" },
  { value: "at_an", label: "An toàn - An ninh" },
  { value: "vt", label: "Vận tải - Giao nhận" },
  { value: "kd", label: "Bán hàng - Kinh doanh " },
  { value: "kh_kt", label: "Khoa học - Kỹ thuật" },
  { value: "it", label: "Công nghệ thông tin" },
  { value: "tc_kt", label: "Tài chính - Kế toán" },
  { value: "tk_kt_nt", label: "Thiết kế - Kiến trúc - Nghệ thuật" },
  { value: "xd", label: "Xây dựng " },
  { value: "cn_sx", label: "Công nghiệp - Sản xuất" },
  { value: "yt_sk", label: "Y tế - Chăm sóc sức khỏe" },
  { value: "tt_mkt", label: "Truyền thông - Quảng cáo" },
  { value: "dv", label: "Dịch vụ khách hàng" },
  { value: "ldpt", label: "Lao động phổ thông" },
  { value: "law", label: "Văn bản - Pháp lý -  Bảo hiểm" },
  { label: "Xuất bản - In ấn", value: "xb" },
  { label: "Phân tích - Thống kê", value: "pt_tk" },
  { value: "tp", label: "Thực phẩm" },
  { value: "bds", label: "Bất động sản" },
];
export const roleOptions = [
  { value: null, label: "Tất cả" },
  { value: 0, label: "Nhân viên/Chuyên viên" },
  { value: 1, label: "Quản lý" },
  { value: 2, label: "Giám đốc" },
  { value: 3, label: "Phó Giám đốc" },
  { value: 4, label: "Thực tập sinh" },
  { value: 5, label: "Trưởng nhóm/Giám sát" },
  { value: 6, label: "Cộng tác viên" },
  { value: 7, label: "Chuyên gia" },
];
export const sexOptions = [
  { value: null, label: "Tất cả" },
  { value: 1, label: "Nam" },
  { value: 2, label: "Nữ" },
];
export const expOptions = [
  { value: null, label: "Tất cả" },
  { value: 0, label: "Chưa có kinh nghiệm" },
  { value: 1, label: "1 năm" },
  { value: 2, label: "2 năm" },
  { value: 3, label: "3 năm" },
  { value: 4, label: "4 năm" },
  { value: 5, label: "Từ 5 năm" }
];
export const levelOptions = [
  { value: null, label: "Tất cả" },
  { value: 0, label: "Không yêu cầu" },
  { value: 1, label: "Chứng chỉ" },
  { value: 2, label: "Trung học" },
  { value: 3, label: "Trung cấp" },
  { value: 4, label: "Cao đẳng" },
  { value: 5, label: "Đại học" },
  { value: 6, label: "Trên đại học" },
];
