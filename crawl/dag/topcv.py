from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
import requests
from lxml import html
import time
import re
import json
import findspark
findspark.init('/opt/spark')  # Adjust the path if Spark is installed elsewhere
from pyspark.sql.functions import col, regexp_extract, udf, to_date, when, regexp_extract, expr, col, to_timestamp, concat, lit, date_format
from pyspark.sql.types import IntegerType, StringType, ArrayType
import json
import re
import pymongo

from pyspark.sql import SparkSession

user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
json_file_path = '/home/chuot/data/topcv.json'
today = datetime.now().strftime("%d/%m/%Y")
def getSpecificPage(url, create_time):
    data = {}
    try:
        response = requests.get(url, headers={'User-agent': user_agent }, timeout= 5)
        if response.status_code == 200:
            data["url"] = url
            data["create_time"] = create_time
            data["crawl_time"] = today
            tree = html.fromstring(response.content)
            title_element = tree.xpath('//*[@id="header-job-info"]/h1')
            if len(title_element):
                a_tag_inside_title = title_element[0].find('.//a')
                if a_tag_inside_title is not None:
                    title = title_element[0].xpath("./a/text()")
                    if len(title):
                        data["title"] = title[0]
                else:
                    data["title"] = title_element[0].text
            company_elements = tree.xpath("//*[@class='job-detail__box--right job-detail__company']//h2/a/text()")
            if len(company_elements):
                data["company"] = company_elements[0]
            company_logo = tree.xpath("//*[@class='job-detail__company--information']//img")
            if len(company_logo):
                data["logo"] = company_logo[0].get('src')
            group_title_element = tree.xpath("//*[@class='job-detail__info--sections']")
            if len(group_title_element):
                salary_elements = group_title_element[0].xpath(".//div[@class='job-detail__info--section']//div[contains(text(), 'Mức lương')]/../div[@class='job-detail__info--section-content-value']/text()")
                if len(salary_elements):
                    data["salary"] = salary_elements[0]
                province_element = group_title_element[0].xpath(".//div[@class='job-detail__info--section']//div[contains(text(), 'Địa điểm')]/../div[@class='job-detail__info--section-content-value']/text()")
                if len(province_element):
                    data["province"] = province_element[0]
            
                
                
            expiration_elements = tree.xpath("//div[@class='job-detail__info--deadline']/text()")
            if len(expiration_elements) >= 2:
                data["expiration"] = expiration_elements[1]
            box_right_info = tree.xpath("//div[@class='job-detail__box--right job-detail__body-right--item job-detail__body-right--box-general']")
            if len(box_right_info):
                role_elements = box_right_info[0].xpath(".//div[@class='box-general-content']//div[contains(text(), 'Cấp bậc')]/../div[@class='box-general-group-info-value']/text()")
                if len(role_elements):
                    data["role"] = role_elements[0]
                experience_elements = box_right_info[0].xpath(".//div[@class='box-general-content']//div[contains(text(), 'Kinh nghiệm')]/../div[@class='box-general-group-info-value']/text()")
                if len(experience_elements):
                    data["experience"] = experience_elements[0]
                experience_elements = box_right_info[0].xpath(".//div[@class='box-general-content']//div[contains(text(), 'Kinh nghiệm')]/../div[@class='box-general-group-info-value']/text()")
                if len(experience_elements):
                    data["experience"] = experience_elements[0]
                type_elements = box_right_info[0].xpath(".//div[@class='box-general-content']//div[contains(text(), 'Hình thức làm việc')]/../div[@class='box-general-group-info-value']/text()")
                if len(type_elements):
                    data["type"] = type_elements[0]
                sex_elements = box_right_info[0].xpath(".//div[@class='box-general-content']//div[contains(text(), 'Giới tính')]/../div[@class='box-general-group-info-value']/text()")
                if len(sex_elements):
                    data["sex"] = sex_elements[0]

            
            box_category_info = tree.xpath("//div[@class='job-detail__box--right job-detail__body-right--item job-detail__body-right--box-category']")
            if len(box_category_info):
                category_elements = box_category_info[0].xpath(".//div[@class='box-category']//div[contains(text(), 'Ngành nghề')]/..//a/text()")
                data["category"] = category_elements
                
            des_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Mô tả công việc')]/..//li/text()")
            if len(des_elements):
                data["description"] = des_elements
            else:
                des_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Mô tả công việc')]/..//p/text()")
                data["description"] = des_elements
            requirement_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Yêu cầu ứng viên')]/..//li/text()")
            if len(requirement_elements):
                data["requirement"] = requirement_elements
            else:
                requirement_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Yêu cầu ứng viên')]/..//p/text()")
                data["requirement"] = requirement_elements
            benefit_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Quyền lợi')]/..//li/text()")
            if len(benefit_elements):
                data["benefit"] = benefit_elements
            else:
                benefit_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Quyền lợi')]/..//p/text()")
                data["benefit"] = benefit_elements
            location_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Địa điểm làm việc')]/../div[@class='job-description__item--content']/div/text()")
            if len(location_elements):
                data["location"] = location_elements
            # else:
            #     location_elements = tree.xpath("//div[@class='job-detail__information-detail--content']//h3[contains(text(), 'Địa điểm làm việc')]/..//p/text()")
            #     data["location"] = location_elements
            
        else:
            print("Status: "+ str(response.status_code))
            time.sleep(5)
        time.sleep(2.5)
    except Exception as e:
        print(e)
    finally:
        # print(data)
        time.sleep(1)
        return data


def run_crawler():
    count = 0
    temp_data = []
    totalWrongData = 0
    stop = False
    for i in range (1, 20):
        if stop:
            break
        try:
            print("Page "+ str(i))
            url = "https://www.topcv.vn/tim-viec-lam-moi-nhat?sort=new&page="+ str(i)+ "&u_sr_id=XcO0F3dgpKHZlf6aEUZ3As8L4OipQyniCEdr7Iw9_1717989152"

            response = requests.get(url, headers={'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'})

            # Parsing the HTML content
            page_tree = html.fromstring(response.content)
            
            job_url = ''
            job_create_time = ''
            
            list_job = page_tree.xpath("//div[@class='job-list-search-result']/div")
            for job in list_job:
                href = job.xpath(".//div[@class='body-content']//a[not(@class)]")
                if len(href):
                    job_url = href[0].get("href")
                create_time_ele = job.xpath(".//div[@class='info']//div[@class='label-content']//label[@class='address mobile-hidden']/text()")
                if len(create_time_ele):
                    job_create_time = create_time_ele[0]
                print(count)
                data = getSpecificPage(job_url, job_create_time)
                if any(data.values()):
                    create_time = data.get("create_time")
                    if create_time is None:
                        print("Not create_time")
                    elif("giờ" in create_time):
                        count += 1
                        temp_data.append(data)
                    else:
                        print("Warning create_time (wrong "+ totalWrongData +" times)="+ create_time)
                        totalWrongData += 1
                        if totalWrongData > 5:
                            print("Stop because update_time wrong > 5")
                            stop = True
                            break
                
            try:
                with open(json_file_path, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                    existing_data.extend(temp_data)
                with open(json_file_path, 'w', encoding='utf-8') as file:
                    json.dump(existing_data, file, indent=4, ensure_ascii=False)
                    temp_data = []
            except Exception as e:
                print("Error when read/write file:" + str(e))
        except Exception as e:
                print("Error:" + str(e))
                
def run_spark_job():
    spark = SparkSession.builder.master("local").appName("topcv").getOrCreate()
    df = spark.read.option("multiline", "true").json(json_file_path)
    df.dropDuplicates()
    df = df.filter(col("company").isNotNull())
    date_pattern = r"(\d{2}/\d{2}/\d{4})"

    df = df.withColumn("certificate", lit(0))
    # df = df.withColumn("age", struct(lit(0).alias("type")))
    df = df.withColumn(
        "sex", when(col("sex") == "Nam", 1).when(col("sex") == "Nữ", 2).otherwise(0)
    )

    # Experience
    def parse_experience(experience):
        if experience is None or experience == "Không yêu cầu kinh nghiệm":
            return {"type": 0}
        if "-" in experience:
            strip_experience = experience.replace("Năm", "").strip()
            min_exp, max_exp = strip_experience.split("-")
            return {"type": 1, "min": int(min_exp), "max": int(max_exp)}
        elif "Dưới" in experience:
            strip_experience = experience.replace("Dưới", "").replace("năm", "").strip()
            max = strip_experience
            return {"type": 3, "max": int(max)}
        elif "Trên" in experience:
            strip_experience = experience.replace("Trên", "").replace("năm", "").strip()
            min = strip_experience
            return {"type": 4, "min": int(min)}
        else:
            fixed = experience.replace("năm", "").strip()
            return {"type": 2, "fixed": int(fixed)}
        return {"type": 0}


    # Type
    def get_type_job(type):
        if type == "Toàn thời gian":
            return 0
        elif type == "Bán thời gian":
            return 2
        elif type == "Thực tập":
            return 4
        else:
            return 5


    def classify_role(role):
        if role is None:
            return 0
        role = role.strip()
        if role == "Nhân viên":
            return 0
        elif role == "Quản lý / Giám sát" or role == "Trưởng chi nhánh":
            return 1
        elif role == "Cộng tác viên":
            return 6
        elif role == "Trưởng nhóm" or role == "Trưởng/Phó phòng":
            return 5
        elif role == "Thực tập sinh":
            return 4
        elif role == "Giám đốc" or role == "Tổng giám đốc":
            return 2
        elif role == "Phó giám đốc":
            return 3
        else:
            return 0


    classify_role_udf = udf(classify_role, IntegerType())
    df = df.withColumn("role", classify_role_udf(col("role")))

    # Salary
    def parse_salary(salary):
        vnd_per_usd = 25
        if salary is None:
            return {"type": 0}
        elif salary.strip() == "Thoả thuận":
            return {"type": 3}
        elif "triệu" in salary:
            salary = salary.replace(" triệu", "").replace(",", ".").strip()
            if "-" in salary:
                min_salary, max_salary = salary.split("-")
                return {
                    "type": 1,
                    "min": float(min_salary.strip()),
                    "max": float(max_salary.strip()),
                }
            elif "Tới" in salary:
                min_salary = salary.replace("Tới", "").strip()
                return {"type": 5, "min": float(min_salary)}
            elif "Trên" in salary:
                max_salary = salary.replace("Trên", "").strip()
                return {"type": 4, "max": float(max_salary)}
        elif "USD" in salary:
            salary = salary.replace(" USD", "").replace(",", "").strip()
            if "-" in salary:
                min_salary, max_salary = salary.split("-")
                return {
                    "type": 1,
                    "min": float(min_salary) * vnd_per_usd / 1000,
                    "max": float(max_salary) * vnd_per_usd / 1000,
                }
            elif "Tới" in salary:
                max_salary = salary.replace("Tới", "").strip()
                return {"type": 4, "max": float(max_salary) * vnd_per_usd / 1000}
            elif "Trên" in salary:
                min_salary = salary.replace("Trên", "").strip()
                return {"type": 5, "min": float(min_salary) * vnd_per_usd / 1000}
        else:
            return {"type": 0}


    # Age
    def parse_age(age):
        return {"type": 0}


    # Extract the date string
    df = df.withColumn("date_str", regexp_extract(col("expiration"), date_pattern, 1))
    # Expiration
    df = df.withColumn(
        "expiration",
        date_format(
            to_timestamp(concat(col("date_str"), lit(" 00:00:00")), "dd/MM/yyyy HH:mm:ss"),
            "yyyy-MM-dd HH:mm:ss",
        ),
    )

    # Update at
    hours_pattern = r"(\d+)\s+giờ"
    days_pattern = r"(\d+)\s+ngày"
    weeks_pattern = r"(\d+)\s+tuần"
    # df = df.withColumn("update_time", date_format(to_timestamp(concat(getCrawlTime(col("crawl_time"), col("create_time")), lit(" 00:00:00")), "dd/MM/yyyy HH:mm:ss"), "yyyy-MM-dd HH:mm:ss"))
    # Extract the time component and calculate days to subtract
    df = df.withColumn(
        "hours", regexp_extract(col("create_time"), hours_pattern, 1).cast("int")
    )
    df = df.withColumn(
        "days", regexp_extract(col("create_time"), days_pattern, 1).cast("int")
    )
    df = df.withColumn(
        "weeks", regexp_extract(col("create_time"), weeks_pattern, 1).cast("int")
    )

    # Calculate the total days to subtract
    df = df.withColumn(
        "days_to_subtract",
        when(col("hours").isNotNull(), 1)
        .when(col("days").isNotNull(), col("days"))
        .when(col("weeks").isNotNull(), col("weeks") * 7)
        .otherwise(0),
    )

    # Convert crawl_time to date
    df = df.withColumn("crawl_time", to_date(col("crawl_time"), "dd/MM/yyyy"))

    # Calculate update_time by subtracting days_to_subtract from crawl_time
    df = df.withColumn("update_time", expr("date_sub(crawl_time, days_to_subtract)"))
    df = df.drop(col("create_time"))
    df = df.drop(col("crawl_time"))
    df = df.drop(col("days_to_subtract"))

    df = df.withColumn(
        "update_time", date_format(to_timestamp(col("update_time")), "yyyy-MM-dd HH:mm:ss")
    )
    # df.select("crawl_time", "create_time", "update_time").show(truncate=False)
    def get_list_type_job(types):
        # Thời vụ/ Nghề tự do, Thực tập
        # type = types.split(",")
        if types is None:
            return []
        return [get_type_job(word.strip()) for word in types.split(",")]


    classify_type_udf = udf(get_list_type_job, ArrayType(IntegerType()))
    df = df.withColumn("type", classify_type_udf(col("type")))


    def clean_description(description):
        if description is None:
            return []
        # Filter out empty strings and None values
        cleaned_descriptions = [
            desc for desc in description if desc is not None and len(desc.strip()) > 0
        ]
        # Apply cleaning to filtered descriptions
        cleaned_descriptions = [
            re.sub(r"^[\-\•\d\.\s]+", "", desc).strip() for desc in cleaned_descriptions
        ]
        return cleaned_descriptions


    clean_description_udf = udf(clean_description, ArrayType(StringType()))
    df = df.withColumn("description", clean_description_udf(col("description")))
    df = df.withColumn("benefit", clean_description_udf(col("benefit")))
    df = df.withColumn("requirement", clean_description_udf(col("requirement")))


    def getProvince(province):
        if province == "An Giang":
            location = "AG"

        elif province == "Bà RịaVũng Tàu":
            location = "BV"

        elif province == "Bạc Liêu":
            location = "BL"

        elif province == "Bắc Kạn" or province == "Bắc Cạn":
            location = "BK"

        elif province == "Bắc Giang":
            location = "BG"

        elif province == "Bắc Ninh":
            location = "BN"

        elif province == "Bến Tre":
            location = "BT"

        elif province == "Bình Dương":
            location = "BD"

        elif province == "Bình Định":
            location = "BDI"

        elif province == "Bình Phước":
            location = "BP"

        elif province == "Bình Thuận":
            location = "BT"

        elif province == "Cà Mau":
            location = "CM"

        elif province == "Cao Bằng":
            location = "CB"

        elif province == "Cần Thơ":
            location = "CT"

        elif province == "Đà Nẵng":
            location = "DN"

        elif province == "Đắk Lắk" or province == "Dak Lak":
            location = "DL"

        elif province == "Đắc Nông":
            location = "DNO"

        elif province == "Điện Biên":
            location = "DB"

        elif province == "Đồng Nai":
            location = "DNA"

        elif province == "Đồng Tháp":
            location = "DT"

        elif province == "Gia Lai":
            location = "GL"

        elif province == "Hà Giang":
            location = "HG"

        elif province == "Hà Nam":
            location = "HNA"

        elif province == "Hà Nội":
            location = "HN"

        elif province == "Hà Tĩnh":
            location = "HT"

        elif province == "Hải Dương":
            location = "HD"

        elif province == "Hải Phòng":
            location = "HP"

        elif province == "Hậu Giang":
            location = "HGI"

        elif province == "Hoà Bình":
            location = "HB"

        elif province == "Hồ Chí Minh" or province == "TP.HCM":
            location = "HCM"

        elif province == "Hưng Yên":
            location = "HY"

        elif province == "Khánh Hoà":
            location = "KH"

        elif province == "Kiên Giang":
            location = "KG"

        elif province == "Kon Tum":
            location = "KT"

        elif province == "Lai Châu":
            location = "LC"

        elif province == "Lạng Sơn":
            location = "LS"

        elif province == "Lào Cai":
            location = "LCA"

        elif province == "Lâm Đồng":
            location = "LD"

        elif province == "Long An":
            location = "LA"

        elif province == "Nam Định":
            location = "ND"

        elif province == "Nghệ An":
            location = "NA"

        elif province == "Ninh Bình":
            location = "NB"

        elif province == "Ninh Thuận":
            location = "NT"

        elif province == "Phú Thọ":
            location = "PT"

        elif province == "Phú Yên":
            location = "PY"

        elif province == "Quảng Bình":
            location = "QB"

        elif province == "Quảng Nam":
            location = "QNA"

        elif province == "Quảng Ngãi":
            location = "QNG"

        elif province == "Quảng Ninh":
            location = "QN"

        elif province == "Quảng Trị":
            location = "QT"

        elif province == "Sóc Trăng":
            location = "ST"

        elif province == "Sơn La":
            location = "SL"

        elif province == "Tây Ninh":
            location = "TN"

        elif province == "Thái Bình":
            location = "TB"

        elif province == "Thái Nguyên":
            location = "TNG"

        elif province == "Thanh Hoá":
            location = "TH"

        elif province == "Thừa Thiên- Huế" or province == "Thừa Thiên Huế":
            location = "TTH"

        elif province == "Tiền Giang":
            location = "TG"

        elif province == "Trà Vinh":
            location = "TV"

        elif province == "Tuyên Quang":
            location = "TQ"

        elif province == "Vĩnh Long":
            location = "VL"

        elif province == "Vĩnh Phúc":
            location = "VP"

        elif province == "Yên Bái":
            location = "YB"
        else:
            print('No match:"' + province + '"')
            location = "other"
        return location


    # location
    def normalize_location(locations):
        arr = []
        if locations == None:
            return []
        for location in locations:
            list_pro_add = location.split(":", 2)
            if len(list_pro_add) == 2:
                province = list_pro_add[0]
                province = province.replace("-", "").strip()
                address = list_pro_add[1]
                arr.append(
                    {
                        "province": getProvince(province),
                        "district": None,
                        "address": address,
                    }
                )
        return arr


    category_mapping = {
        "Du lịch": "dv",
        "Hàng gia dụng": "kd",
        "Địa chất / Khoáng sản": "cn_sx",
        "Sản phẩm công nghiệp": "cn_sx",
        "Hành chính / Văn phòng": "hc_ql",
        "In ấn / Xuất bản": "xb",
        "An toàn lao động": "at_an",
        "Spa / Làm đẹp": "dv",
        "Công nghệ cao": "kh_kt",
        "IT Phần cứng / Mạng": "it",
        "Luật/Pháp lý": "law",
        "Marketing / Truyền thông / Quảng cáo": "tt_mkt",
        "Dầu khí/Hóa chất": "cn_sx",
        "Quản lý điều hành": "hc_ql",
        "Thực phẩm / Đồ uống": "tp",
        "Kiến trúc": "tk_kt_nt",
        "Ngành nghề khác": "other",
        "Thư ký / Trợ lý": "hc_ql",
        "Điện / Điện tử / Điện lạnh": "kh_kt",
        "Kinh doanh / Bán hàng": "kd",
        "Bảo trì / Sửa chữa": "kh_kt",
        "Chứng khoán / Vàng / Ngoại tệ": "tc_kt",
        "Hàng không": "vt",
        "Môi trường / Xử lý chất thải": "cn_sx",
        "Bất động sản": "bds",
        "Tư vấn": "dv",
        "Dịch vụ khách hàng": "dv",
        "Y tế / Chăm sóc sức khỏe": "yt_sk",
        "Mỹ phẩm / Trang sức": "kd",
        "Cơ khí / Chế tạo / Tự động hóa": "kh_kt",
        "Giáo dục / Đào tạo": "gd_dt",
        "Hàng tiêu dùng": "kd",
        "Thiết kế đồ họa": "tk_kt_nt",
        "Bán lẻ / Bán sỉ": "kd",
        "Tài chính / Đầu tư": "tc_kt",
        "IT phần mềm": "it",
        "Sản xuất": "cn_sx",
        "Mỹ thuật / Nghệ thuật / Điện ảnh": "tk_kt_nt",
        "Tổ chức sự kiện / Quà tặng": "dv",
        "Hoạch định/Dự án": "xd",
        "Bán lẻ / bán sỉ": "kd",
        "Kế toán / Kiểm toán": "tc_kt",
        "Xuất nhập khẩu": "vt",
        "Công nghệ Ô tô": "cn_sx",
        "Quản lý chất lượng (QA/QC)": "hc_ql",
        "Biên / Phiên dịch": "dv",
        "Thời trang": "tk_kt_nt",
        "Nông / Lâm / Ngư nghiệp": "nn_ln_ts",
        "Điện tử viễn thông": "dv",
        "Ngân hàng / Tài chính": "tc_kt",
        "Công nghệ thông tin": "it",
        "Nhân sự": "hc_ql",
        "Hàng hải": "vt",
        "Y tế / Dược": "yt_sk",
        "Xây dựng": "xd",
        "Dược phẩm / Công nghệ sinh học": "kh_kt",
        "Bảo hiểm": "dv",
        "Việc làm IT": "it",
        "Khách sạn / Nhà hàng": "dv",
        "Thiết kế nội thất": "tk_kt_nt",
        "Logistics": "vt",
        "Bưu chính - Viễn thông": "dv",
        "Hàng cao cấp": "kd",
        "Vận tải / Kho vận": "vt",
        "Dệt may / Da giày": "cn_sx",
        "Hoá học / Sinh học": "kh_kt",
        "Bán hàng kỹ thuật": "kd",
        "Báo chí / Truyền hình": "tt_mkt",
        "Phi chính phủ / Phi lợi nhuận": "other",
        "NGO / Phi chính phủ / Phi lợi nhuận": "other"
    }


    def parse_category(categories):
        if categories is None or len(categories) == 0:
            return []
        else:
            category_arr = []
            for category in categories:
                if category in category_mapping:
                    category_arr.append(category_mapping[category])
                else:
                    print("No result field: " + category)
                    category_arr.append("other")
            return category_arr


    df = df.drop(col("province"))
    df = df.drop(col("hours"))
    df = df.drop(col("days"))
    df = df.drop(col("weeks"))
    df = df.drop(col("date_str"))

    rdd = df.rdd.map(
        lambda row: {
            **row.asDict(),
            "salary": parse_salary(row["salary"]),
            "age": parse_age(row["experience"]),
            "location": normalize_location(row["location"]),
            "experience": parse_experience(row["experience"]),
            "field": parse_category(row["category"]),
        }
    )

    # rdd.top(5)
    count = rdd.count()

    # Insert dữ liệu vào collection "jobs"
    def insert_into_mongodb(partition):
        client = pymongo.MongoClient(
            "mongodb://localhost:27017/", username="admin", password="20194856"
        )
        db = client["thesis"]
        collection = db["jobs"]

        for record in partition:
            # print(record)
            collection.insert_one(record)


    # Insert dữ liệu vào collection "jobs"
    rdd.foreachPartition(insert_into_mongodb)
    print("Add sucess "+ str(count) + " to DB.")
    spark.stop()


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 7, 2),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}
dag = DAG(
    'topcv',
    default_args=default_args,
    description='DAG for topcv',
    schedule_interval=timedelta(days=1),
)


crawler_task = PythonOperator(
    task_id='run_crawler_topcv',
    python_callable=run_crawler,
    dag=dag,
)

spark_job_task = PythonOperator(
    task_id='run_spark_job_topcv',
    python_callable=run_spark_job,
    dag=dag
)
crawler_task >> spark_job_task