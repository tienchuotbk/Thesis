const provinces = [
    {
        "label": "Tất cả tỉnh thành",
        "value": "all"
    },
    {
        "label": "Bắc Giang",
        "value": "Bắc Giang"
    },
    {
        "label": "Bắc Kạn",
        "value": "Bắc Kạn"
    },
    {
        "label": "Cao Bằng",
        "value": "Cao Bằng"
    },
    {
        "label": "Hà Giang",
        "value": "Hà Giang"
    },
    {
        "label": "Lạng Sơn",
        "value": "Lạng Sơn"
    },
    {
        "label": "Phú Thọ",
        "value": "Phú Thọ"
    },
    {
        "label": "Quảng Ninh",
        "value": "Quảng Ninh"
    },
    {
        "label": "Thái Nguyên",
        "value": "Thái Nguyên"
    },
    {
        "label": "Tuyên Quang",
        "value": "Tuyên Quang"
    },
    {
        "label": "Lào Cai",
        "value": "Lào Cai"
    },
    {
        "label": "Yên Bái",
        "value": "Yên Bái"
    },
    {
        "label": "Điện Biên",
        "value": "Điện Biên"
    },
    {
        "label": "Hòa Bình",
        "value": "Hòa Bình"
    },
    {
        "label": "Lai Châu",
        "value": "Lai Châu"
    },
    {
        "label": "Sơn La",
        "value": "Sơn La"
    },
    {
        "label": "Bắc Ninh",
        "value": "Bắc Ninh"
    },
    {
        "label": "Hà Nam",
        "value": "Hà Nam"
    },
    {
        "label": "Hải Dương",
        "value": "Hải Dương"
    },
    {
        "label": "Hưng Yên",
        "value": "Hưng Yên"
    },
    {
        "label": "Nam Định",
        "value": "Nam Định"
    },
    {
        "label": "Ninh Bình",
        "value": "Ninh Bình"
    },
    {
        "label": "Thái Bình",
        "value": "Thái Bình"
    },
    {
        "label": "Vĩnh Phúc",
        "value": "Vĩnh Phúc"
    },
    {
        "label": "Hà Nội",
        "value": "Hà Nội"
    },
    {
        "label": "Hải Phòng",
        "value": "Hải Phòng"
    },
    {
        "label": "Hà Tĩnh",
        "value": "Hà Tĩnh"
    },
    {
        "label": "Nghệ An",
        "value": "Nghệ An"
    },
    {
        "label": "Quảng Bình",
        "value": "Quảng Bình"
    },
    {
        "label": "Quảng Trị",
        "value": "Quảng Trị"
    },
    {
        "label": "Thanh Hóa",
        "value": "Thanh Hóa"
    },
    {
        "label": "Thừa Thiên–Huế",
        "value": "Thừa Thiên–Huế"
    },
    {
        "label": "Đắk Lắk",
        "value": "Đắk Lắk"
    },
    {
        "label": "Đắk Nông",
        "value": "Đắk Nông"
    },
    {
        "label": "Gia Lai",
        "value": "Gia Lai"
    },
    {
        "label": "Kon Tum",
        "value": "Kon Tum"
    },
    {
        "label": "Lâm Đồng",
        "value": "Lâm Đồng"
    },
    {
        "label": "Bình Định",
        "value": "Bình Định"
    },
    {
        "label": "Bình Thuận",
        "value": "Bình Thuận"
    },
    {
        "label": "Khánh Hòa",
        "value": "Khánh Hòa"
    },
    {
        "label": "Ninh Thuận",
        "value": "Ninh Thuận"
    },
    {
        "label": "Phú Yên",
        "value": "Phú Yên"
    },
    {
        "label": "Quảng Nam",
        "value": "Quảng Nam"
    },
    {
        "label": "Quảng Ngãi",
        "value": "Quảng Ngãi"
    },
    {
        "label": "Đà Nẵng",
        "value": "Đà Nẵng"
    },
    {
        "label": "Bà Rịa–Vũng Tàu",
        "value": "Bà Rịa–Vũng Tàu"
    },
    {
        "label": "Bình Dương",
        "value": "Bình Dương"
    },
    {
        "label": "Bình Phước",
        "value": "Bình Phước"
    },
    {
        "label": "Đồng Nai",
        "value": "Đồng Nai"
    },
    {
        "label": "Tây Ninh",
        "value": "Tây Ninh"
    },
    {
        "label": "Hồ Chí Minh",
        "value": "Hồ Chí Minh"
    },
    {
        "label": "An Giang",
        "value": "An Giang"
    },
    {
        "label": "Bạc Liêu",
        "value": "Bạc Liêu"
    },
    {
        "label": "Bến Tre",
        "value": "Bến Tre"
    },
    {
        "label": "Cà Mau",
        "value": "Cà Mau"
    },
    {
        "label": "Đồng Tháp",
        "value": "Đồng Tháp"
    },
    {
        "label": "Hậu Giang",
        "value": "Hậu Giang"
    },
    {
        "label": "Kiên Giang",
        "value": "Kiên Giang"
    },
    {
        "label": "Long An",
        "value": "Long An"
    },
    {
        "label": "Sóc Trăng",
        "value": "Sóc Trăng"
    },
    {
        "label": "Tiền Giang",
        "value": "Tiền Giang"
    },
    {
        "label": "Trà Vinh",
        "value": "Trà Vinh"
    },
    {
        "label": "Vĩnh Long",
        "value": "Vĩnh Long"
    },
    {
        "label": "Cần Thơ",
        "value": "Cần Thơ"
    }
]

export default provinces;