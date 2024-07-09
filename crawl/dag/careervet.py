from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
import requests
from lxml import html
import time
import re
import json
import findspark
findspark.init('/opt/spark') 
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf, when, col, to_timestamp, concat, lit, date_format
from pyspark.sql.types import IntegerType, StringType, ArrayType
import json
import re
import pymongo


user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
def getSpecificPage(url):
    data = {}
    try:
        response = requests.get(url, headers={'User-agent': user_agent }, timeout= 10)
        if response.status_code == 200:
            data["url"] = url
            tree = html.fromstring(response.content)
            title_element = tree.xpath("//*[@class='search-result-list-detail template-2']//h1")
            if len(title_element):
                data["title"] = title_element[0].text_content()
            else:
                print("Cannot get title")
            company_element = tree.xpath("//*[@class='search-result-list-detail template-2']//div[@class='job-desc']/a")
            if len(company_element):
                data["company"] = company_element[0].text_content()
            else:
                print("Cannot get company")
            group_info_element = tree.xpath("//*[@class='job-detail-content']/div[@class='bg-blue']")
            if len(group_info_element):
                group_info_ele = group_info_element[0]
                job_update_time = group_info_ele.xpath(".//strong[contains(text(), 'Ngày cập nhật')]/../p/text()")
                if len(job_update_time):
                    data["update_time"] = job_update_time[0]
                job_salary = group_info_ele.xpath(".//strong[contains(text(), 'Lương')]/../p/text()")
                if len(job_salary):
                    data["salary"] = job_salary[0]
                job_category = group_info_ele.xpath(".//*[@class='detail-box has-background']//a/text()")
                if len(job_category):
                    data["category"] = [  item.replace('\r\n', '').replace('  ', '').strip() for item in job_category ]
                job_exp = group_info_ele.xpath(".//strong[contains(text(), 'Kinh nghiệm')]/../p/text()")
                if len(job_exp):
                    data["experience"] = job_exp[0].replace('\r\n', '').replace('  ', '').strip()
                job_exp = group_info_ele.xpath(".//strong[contains(text(), 'Kinh nghiệm')]/../p/text()")
                if len(job_exp):
                    data["experience"] = job_exp[0].replace('\r\n', '').replace('  ', '').strip()

                job_role = group_info_ele.xpath(".//strong[contains(text(), 'Cấp bậc')]/../p/text()")
                if len(job_role):
                    data["role"] = job_role[0]

                job_type = group_info_ele.xpath(".//strong[contains(text(), 'Hình thức')]/../p/text()")
                if len(job_type):
                    data["type"] = job_type[0]
                
                job_expiration = group_info_ele.xpath(".//strong[contains(text(), 'Hết hạn nộp')]/../p/text()")
                if len(job_expiration):
                    data["expiration"] = job_expiration[0]

            location_element = tree.xpath("//*[@id='maps-tab-1']//ul[@class='clearall']/li/a/text()")
            if len(location_element):
                data["location"] = location_element
            province_element = tree.xpath("//*[@class='job-detail-content']//div[@class='map']/p/a/text()")
            if len(province_element):
                data["province"] = province_element
            company_info = tree.xpath("//li[@id='tabs-job-company']//a/@href")
            # print(company_info)
            if len(company_info):
                try:
                    res = requests.get(company_info[0].strip(), headers={'User-agent': user_agent}, timeout=5)
                    if res.status_code == 200:
                        subtree = html.fromstring(res.content)
                        logo_element = subtree.xpath("//*[@class='company-introduction']//div[@class='img']/img/@src")
                        if(len(logo_element)):
                            data["logo"] = logo_element[0].strip()
                except Exception as e:
                    print(e)
                
            other_info_group = tree.xpath('//*[contains(@class, "content_fck")]')
            # print(other_info_group)
            if len(other_info_group):
                other_info = other_info_group[0]
                sex_element = other_info.xpath('./descendant::*[contains(text(), "Giới tính")]')
                if len(sex_element):
                    data["sex"] = sex_element[0].text_content().replace("Giới tính:", "").strip()
                age_element = other_info.xpath('./descendant::*[contains(text(), "Độ tuổi")]')
                if len(age_element):
                    data["age"] = age_element[0].text_content().replace("Độ tuổi:", "").strip()
                certificate_element = other_info.xpath('./descendant::*[contains(text(), "Bằng cấp")]')
                if len(certificate_element):
                    data["certificate"] = certificate_element[0].text_content().replace("Bằng cấp:", "").strip()

            job_description_title = tree.xpath("*//h2[contains(text(), 'Mô tả Công việc')]")
            if len(job_description_title):
                job_des_parent = job_description_title[0].getparent()
                if len(job_des_parent.xpath("./descendant::ul")):
                    list_des = job_des_parent.xpath(".//li/text()")
                    data["description"] = list_des
                else:
                    list_des = job_des_parent.xpath(".//p/text()")
                    data["description"] = list_des

            job_requirement_title = tree.xpath("*//h2[contains(text(), 'Yêu Cầu Công Việc')]")
            if len(job_requirement_title):
                job_req_parent = job_requirement_title[0].getparent()
                if len(job_req_parent.xpath("./descendant::ul")):
                    list_req = job_req_parent.xpath(".//li/text()")
                    data["requirement"] =  [re.sub(r'\xa0+', ' ', x) for x in list_req]
                else:
                    list_req = job_req_parent.xpath(".//p/text()")
                    data["requirement"] =  [re.sub(r'\xa0+', ' ', x) for x in list_req]
            
            job_benefit_title = tree.xpath("*//h2[contains(text(), 'Phúc lợi')]")
            if len(job_benefit_title):
                job_des_parent = job_benefit_title[0].getparent()
                if len(job_des_parent.xpath("./descendant::ul")):
                    list_benefit = job_des_parent.xpath(".//li/text()")
                    data["benefit"] = list_benefit
                else:
                    list_benefit = job_des_parent.xpath(".//p/text()")
                    data["benefit"] = list_benefit
        time.sleep(0.2)
    except Exception as e:
        print(e)
    finally:
        # print(data)
        return data


def run_crawler():
    current_date = datetime.now().strftime("%d/%m/%Y")
    count = 0
    temp_data = []
    stop = False
    totalWrongData = 0
    for i in range (1, 50):
        if stop:
            break
        try:
            print("Page "+ str(i))
            url = "https://careerviet.vn/viec-lam/tat-ca-viec-lam-sortdv-trang-"+ str(i)+"-vi.html"

            response = requests.get(url, headers={'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'})

            # Parsing the HTML content
            tree = html.fromstring(response.content)

            # Extracting the title element using XPath
            list_a = tree.xpath('//div[@class="jobs-side-list"]//h2/a')
            for a in list_a:
                job_url = a.get("href")
                # print(job_url)
                
                count += 1
                print(count)
                data = getSpecificPage(job_url)
                if any(data.values()):
                    job_time = data.get("update_time")
                    if job_time is None:
                        print("Not update_time")
                        continue
                    elif(job_time == current_date or job_time == "08/07/2024" or job_time == "07/07/2024"):
                        temp_data.append(data)
                    else:
                        print("Warning update_time["+ str(totalWrongData) +"]="+ job_time)
                        totalWrongData += 1
                        if totalWrongData > 10:
                            print("Stop because update_time wrong > 20")
                            stop = True
                            break
                        
            try:
                with open('/home/chuot/data/careerviet.json', 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                    existing_data.extend(temp_data)
                with open('/home/chuot/data/careerviet.json', 'w', encoding='utf-8') as file:
                    json.dump(existing_data, file, indent=4, ensure_ascii=False)
                    temp_data = []
            except Exception as e:
                print("Error when read/write file:" + str(e))
        except Exception as e:
                print("Error when read/write file:" + str(e))
    pass
def run_spark_job():
    json_file_path = '/home/chuot/data/careerviet.json'
    spark = SparkSession.builder.master("local").appName("example").getOrCreate()
    df = spark.read.option("multiline","true").json(json_file_path)
    df.dropDuplicates()
    df = df.filter(col("company").isNotNull())

    df = df.withColumn(
        "certificate",
        when(col("certificate") == None, 0)
        .when(col("certificate") == "Chứng chỉ", 1)
        .when(col("certificate") == "Trung học", 2)
        .when(col("certificate") == "Trung cấp", 3)
        .when(col("certificate") == "Cao đẳng", 4)
        .when(col("certificate") == "Đại học", 5)
        .when(col("certificate") == "Sau đại học", 6)
        .otherwise(0)
    )

    df = df.withColumn(
        "sex",
        when(col("sex") == "Nam", 1)
        .when(col("sex") == "Nữ", 2)
        .otherwise(0)
    )

    # Salary
    def parse_salary(salary):
        vnd_per_usd = 25
        if salary is None:
            return {"type": 0 }
        elif (salary.strip().lower() == "cạnh tranh"):
            return {"type": 3 }
        elif "VND" in salary:
                salary = salary.replace(" VND", "").replace(" Tr", "").replace(",", ".").strip()
                if "-" in salary:
                    min_salary, max_salary = salary.split("-")
                    return {"type": 1, "min": float(min_salary), "max": float(max_salary) }
                elif "Trên" in salary:
                    min_salary = salary.replace("Trên", "").strip()
                    return {"type": 5, "min": float(min_salary)}
                elif "Lên đến" in salary:
                    max_salary = salary.replace("Lên đến", "").strip()
                    return {"type": 4, "max": float(max_salary)}
        elif "USD" in salary:
            salary = salary.replace(" USD", "").replace(" Tr", "").replace(",", "").strip()
            if "-" in salary:
                min_salary, max_salary = salary.split("-")
                return {"type": 1, "min": float(min_salary)* vnd_per_usd / 1000, "max": float(max_salary)* vnd_per_usd /1000}
            elif "Trên" in salary:
                min_salary = salary.replace("Trên", "").strip()
                return {"type": 5, "min": float(min_salary)* vnd_per_usd / 1000}
            elif "Lên đến" in salary:
                max_salary = salary.replace("Lên đến", "").strip()
                return {"type": 4, "min": float(max_salary)* vnd_per_usd / 1000}
        else:
            return {"type": 0 }
                    
    # Age
    def parse_age(age):
        if age is None or age == "Không giới hạn tuổi":
            return { "type": 0 }
        # age = age.strip().lower()
        if "-" in age:
            strip_age = age.strip()
            min_age, max_age = age.strip().split("-")
            return { "type": 1, "min": int(min_age), "max": int(max_age) }
        elif "Trên" in age:
            min_age = age.replace("Trên ", "")
            return { "type": 4, "min": int(min_age)}
        elif "Dưới" in age:
            max_age = age.replace("Dưới ", "")
            return { "type": 3, "min": int(max_age)}  
        else:
            fixed = age.strip()
            return { "type": 2, "fixed": int(fixed)}  
        return { "type": 0 }

    # Experience
    def parse_experience(experience):
        if experience is None or experience == "Chưa có kinh nghiệm":
            return { "type": 0 }
        if "-" in experience:
            strip_experience = experience.replace("Năm", "").strip()
            min_exp, max_exp = strip_experience.split("-")
            return {"type": 1, "min": int(min_exp), "max": int(max_exp) }
        elif "Lên đến" in experience:
            strip_experience = experience.replace("Lên đến", "").replace("Năm", "").strip()
            max = strip_experience
            return { "type": 3, "max": int(max) }
        elif "Trên" in experience:
            strip_experience = experience.replace("Trên", "").replace("Năm", "").strip()
            min = strip_experience
            return { "type": 4, "min": int(min) }
        else:
            fixed = experience.replace("Năm", "").strip()
            return { "type": 2, "fixed": int(fixed)}
        return { "type": 0 }

    # Expiration
    df = df.withColumn("expiration", date_format(to_timestamp(concat(col("expiration"), lit(" 00:00:00")), "dd/MM/yyyy HH:mm:ss"), "yyyy-MM-dd HH:mm:ss"))

    # Update at
    df = df.withColumn("update_time", date_format(to_timestamp(concat(col("update_time"), lit(" 00:00:00")), "dd/MM/yyyy HH:mm:ss"), "yyyy-MM-dd HH:mm:ss"))

    # Type
    def get_type_job(type):
        if type == "Nhân viên chính thức":
            return 0
        elif type == "Bán thời gian":
            return 2
        elif type == "Thời vụ/ Nghề tự do":
            return 1
        elif type == "Thực tập":
            return 4
        else:
            return 5
    def get_list_type_job(types):
        # Thời vụ/ Nghề tự do, Thực tập
        # type = types.split(",")
        if types is None:
            return []
        return [get_type_job(word.strip()) for word in types.split(",")]


    classify_type_udf = udf(get_list_type_job, ArrayType(IntegerType()))
    df = df.withColumn("type", classify_type_udf(col("type")))

    # Role
    def classify_role(role):
        if role is None:
            return 0
        role = role.strip()
        if role == "Nhân viên":
            return 0
        elif role == "Quản lý" or role == "Quản lý cấp trung":
            return 1
        elif role == "Cộng tác viên":
            return 6
        elif role == "Trưởng nhóm / Giám sát":
            return 5
        elif role == "Sinh viên/ Thực tập sinh" or role == "Mới tốt nghiệp":
            return 4
        elif role == "Giám đốc" or role == "Tổng giám đốc":
            return 2
        elif role == "Phó Giám đốc":
            return 3
        elif role == "Chuyên gia":
            return 7
        else:
            return 0
    classify_role_udf = udf(classify_role, IntegerType())
    df = df.withColumn("role", classify_role_udf(col("role")))

    def normalize_benefit(benefits):
        if benefits is None:
            return []
        return list(map(lambda benefit: re.sub(r'^[*\-+]+', '', benefit).strip(), benefits))
    benefit_udf = udf(normalize_benefit, ArrayType(StringType()))
    df = df.withColumn("benefit", benefit_udf(col("benefit")))
    df = df.withColumn("requirement", benefit_udf(col("requirement")))
    df = df.withColumn("description", benefit_udf(col("requirement")))

    def getProvince(province):
        if province == "An Giang": 
            location = "AG"
        elif province == "Bà Rịa - Vũng Tàu": 
            location = "BV"
        elif province == "Bạc Liêu": 
            location = "BL"
        elif province == "Bắc Kạn" or province == 'Bắc Cạn': 
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
        elif province == "Đắk Lắk" or province == 'Dak Lak': 
            location = "DL"
        elif province == "Đắk Nông" or province == 'Dak Nông': 
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
        elif province == "Hòa Bình": 
            location = "HB"
        elif province == 'Hồ Chí Minh' or province == "TP.HCM" : 
            location = "HCM"
        elif province == "Hưng Yên": 
            location = "HY"
        elif province == "Khánh Hòa": 
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
        elif province == "Thanh Hóa": 
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
            print("No match:\""+ province+ "\"")
            location = 'other'
        return location

    # location
    def normalize_location(provinces, locations):
        arr = []
        if provinces is None:
            provinces = []
        if locations is None:
            locations = []
        if len(locations) == 0 and len(provinces) == 0:
            return []
        if len(locations) == 0 and len(provinces) > 0:
            for province in provinces:
                arr.append({"province": getProvince(province), "district": None, "address": province})
        else:   
            for province, location in zip(provinces, locations):
                parts = [part.strip() for part in location.split(',') if part.strip()]
                if len(parts) >= 2:
                    job_province = parts[-1]
                    district = None
                    if job_province == province:
                        district = parts[-2]
                    else:
                        district = [address for address in parts if 'huyện' in address.lower() or 'Q.' in address or 'Quận' in address.lower()]
                    arr.append({"province": getProvince(province), "district": district, "address": location})
                else: 
                    arr.append({"address": location, "district": None, "province": getProvince(province)})
        return arr

    category_mapping = {
        "Du lịch": "dv",
        "Thủy lợi": "nn_ln_ts",
        "Công nghệ thực phẩm / Dinh dưỡng": "tp",
        "Lâm Nghiệp": "nn_ln_ts",
        "In ấn / Xuất bản": "xb",
        "An toàn lao động": "at_an",
        "Hành chính / Thư ký": "hc_ql",
        "CNTT - Phần mềm": "it",
        "Quảng cáo / Đối ngoại / Truyền Thông": "tt_mkt",
        "Nông nghiệp": "nn_ln_ts",
        "Ngân hàng": "tc_kt",
        "Quản lý điều hành": "hc_ql",
        "Kiến trúc": "tk_kt_nt",
        "Mỹ thuật / Nghệ thuật / Thiết kế": "tk_kt_nt",
        "Trắc địa / Địa Chất": "kh_kt",
        "Điện / Điện tử / Điện lạnh": "kh_kt",
        "Hàng gia dụng / Chăm sóc cá nhân": "kd",
        "Chứng khoán": "tc_kt",
        "Bảo trì / Sửa chữa": "cn_sx",
        "Tổ chức sự kiện": "dv",
        "Sản xuất / Vận hành sản xuất": "cn_sx",
        "Nhà hàng / Khách sạn": "dv",
        "Hàng không": "vt",
        "Luật / Pháp lý": "law",
        "Bất động sản": "bds",
        "Tư vấn": "dv",
        "Dịch vụ khách hàng": "dv",
        "Y tế / Chăm sóc sức khỏe": "yt_sk",
        "Công nghệ sinh học": "kh_kt",
        "Giáo dục / Đào tạo": "gd_dt",
        "Chăn nuôi / Thú y": "nn_ln_ts",
        "An Ninh / Bảo Vệ": "at_an",
        "CNTT - Phần cứng / Mạng": "it",
        "Dầu khí": "cn_sx",
        "Môi trường": "cn_sx",
        "Bán lẻ / Bán sỉ": "kd",
        "Tài chính / Đầu tư": "tc_kt",
        "Thủy sản / Hải sản": "nn_ln_ts",
        "Phi chính phủ / Phi lợi nhuận": "dv",
        "Kế toán / Kiểm toán": "tc_kt",
        "Bán hàng / Kinh doanh": "kd",
        "Xuất nhập khẩu": "vt",
        "Giải trí": "dv",
        "Quản lý chất lượng (QA/QC)": "hc_ql",
        "Đồ gỗ": "cn_sx",
        "Hóa học": "kh_kt",
        "Nội ngoại thất": "tk_kt_nt",
        "Nhân sự": "hc_ql",
        "Hàng hải": "vt",
        "Dược phẩm": "yt_sk",
        "Vận chuyển / Giao nhận /Kho vận": "vt",
        "Thống kê": "pt_tk",
        "Tiếp thị / Marketing": "tt_mkt",
        "Cơ khí / Ô tô / Tự động hóa": "kh_kt",
        "Xây dựng": "xd",
        "Biên phiên dịch": "dv",
        "Bảo hiểm": "law",
        "Truyền hình / Báo chí / Biên tập": "tt_mkt",
        "Ngành khác": "other",
        "Bưu chính viễn thông": "tt_mkt",
        "Thu mua / Vật tư": "kd",
        "Dệt may / Da giày / Thời trang": "cn_sx",
        "Mới tốt nghiệp / Thực tập": "other",
        "Lao động phổ thông": "ldpt",
        "Thực phẩm & Đồ uống": "tp",
        "Tiếp thị trực tuyến": "tt_mkt",
        "Khác": "other",
        "Thư viện": "hc_ql",
        "Khoáng sản": "cn_sx"
    }

    def parse_category(categories):
        if categories is None or len(categories) == 0:
            return []
        else :
            category_arr = []
            for category in categories:
                if category in category_mapping:
                    category_arr.append(category_mapping[category])
                else:
                    print("No result field: "+ category)
                    category_arr.append("other")
            return category_arr

    rdd = df.rdd.map(lambda row: {
        **row.asDict(),
        "salary": parse_salary(row["salary"]),
        "age": parse_age(row["age"]),
        "location": normalize_location(row["province"], row["location"]),
        "experience": parse_experience(row["experience"]),
        "field": parse_category(row["category"])
    })

    # # Insert dữ liệu vào collection "jobs"
    def insert_into_mongodb(partition):
        client = pymongo.MongoClient("mongodb://localhost:27017/", username='admin', password='20194856')
        db = client["thesis"]
        collection = db["jobs"]

        for record in partition:
            collection.insert_one(record)

    # Insert dữ liệu vào collection "jobs"
    rdd.foreachPartition(insert_into_mongodb)
    print("Add sucess "+ str(rdd.count()) + " jobs to DB.")

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 7, 7),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}
dag = DAG(
    'careerviet',
    default_args=default_args,
    description='DAG for careerviet',
    schedule_interval=timedelta(days=1),
)


crawler_task = PythonOperator(
    task_id='run_crawler_careerviet',
    python_callable=run_crawler,
    dag=dag,
)

spark_job_task = PythonOperator(
    task_id='run_spark_job_careerviet',
    python_callable=run_spark_job,
    dag=dag
)
crawler_task >> spark_job_task