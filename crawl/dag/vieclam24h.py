import findspark
findspark.init('/opt/spark') 
import requests
from lxml import html
import time
import re
import json
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf, when, date_format, col, to_timestamp, concat, lit
from pyspark.sql.types import IntegerType, StringType, ArrayType
import json
import re
from rapidfuzz import fuzz 
import pymongo
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
service = Service(executable_path=r'/usr/bin/chromedriver')
options = webdriver.ChromeOptions()
options.add_experimental_option(
    "prefs", {
        # block image loading
        "profile.managed_default_content_settings.images": 2,
    }
)
options.add_argument("--headless")
driver = webdriver.Chrome(service=service, options=options)
user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'

def getSpecificPage(url):
    data = {}
    try:
        response = requests.get(url, headers={'User-agent': user_agent })
        if response.status_code == 200:
            data["url"] = url
            tree = html.fromstring(response.content)
            title_element = tree.xpath("//h1[contains(@class, 'leading-snug')]")
            if len(title_element):
                data["title"] = title_element[0].text_content()
            else:
                print("Cannot get title")
            logo_element = tree.xpath("//*[contains(@class, 'md:flex w-full items-start')]//img[@alt='logo']/@src")
            if len(logo_element):
                data['logo'] = logo_element[0]
            company_element = tree.xpath("//*[@class='md:ml-7 w-full']/a")
            if len(company_element):
                data["company"] = company_element[0].text_content()
            else:
                print("Cannot get company")
            salary_element = tree.xpath("//*[@class='font-semibold text-14 text-[#8B5CF6]']")
            if len(salary_element):
                data["salary"] = salary_element[0].text_content()
            else:
                print("Cannot get salary")
            title_group_element = tree.xpath("//*[@class='md:flex w-full items-start']")
            if len(title_group_element):
                expiration_element = title_group_element[0].xpath('.//p[contains(text(), "Hạn nộp hồ sơ")]/..//p[contains(@class, "text-14")]')
                if len(expiration_element):
                    data["expiration"] = expiration_element[0].text_content()
            else:
                print("Cannot get expiration and location")
            group_element = tree.xpath("//*[@class='jsx-d84db6a84feb175e px-4 md:px-10 py-4 bg-white shadow-sd-12 rounded-sm']")
            if len(group_element):
                role_element = group_element[0].xpath('.//p[contains(text(), "Cấp bậc")]/..//p[@class="text-14"]')
                if len(role_element):
                    data["role"] = role_element[0].text_content()
                role_element = group_element[0].xpath('.//p[contains(text(), "Yêu cầu giới tính")]/..//p[@class="text-14"]')
                if len(role_element):
                    data["sex"] = role_element[0].text_content()
                role_element = group_element[0].xpath('.//p[contains(text(), "Hình thức làm việc")]/..//p[@class="text-14"]')
                if len(role_element):
                    data["type"] = role_element[0].text_content()
                role_element = group_element[0].xpath('.//p[contains(text(), "Độ tuổi")]/..//p[@class="text-14"]')
                if len(role_element):
                    data["age"] = role_element[0].text_content()
                role_element = group_element[0].xpath('.//p[contains(text(), "Yêu cầu kinh nghiệm")]/..//p[@class="text-14"]')
                if len(role_element):
                    data["experience"] = role_element[0].text_content()
                role_element = group_element[0].xpath('.//p[contains(text(), "Ngành nghề")]/..//p[@class="text-14 text-se-accent font-semibold"]')
                if len(role_element):
                    data["category"] = role_element[0].text_content().split('/')

            job_description_title = tree.xpath("*//h2[contains(text(), 'Mô tả công việc')]")
            if len(job_description_title):
                job_des_parent = job_description_title[0].getparent()
                job_description_element = job_des_parent.xpath("./descendant::div[@class='jsx-d84db6a84feb175e mb-2 text-14 break-words text-se-neutral-80 text-description']")
                if len(job_description_element):
                    if len(job_description_element[0].xpath("./descendant::ul")):
                        list_des = job_description_element[0].xpath(".//li/text()")
                        if len(list_des) == 0:
                            list_des = job_description_element[0].xpath(".//strong/text()")
                        data["description"] = [re.sub(r'\xa0+', ' ', x) for x in list_des]
                    else:
                        list_des = job_description_element[0].xpath(".//p/text()")
                        data["description"] = [re.sub(r'\xa0+', ' ', x) for x in list_des]
            
            # Job benefits
            job_benefit_title = tree.xpath("*//h2[contains(text(), 'Quyền lợi')]")
            if len(job_benefit_title):
                job_benefit_parent = job_benefit_title[0].getparent()
                job_benefit_element = job_benefit_parent.xpath("./descendant::div[@class='jsx-d84db6a84feb175e mb-2 text-14 break-words text-se-neutral-80 text-description']")
                if len(job_benefit_element):
                    if len(job_benefit_element[0].xpath("./descendant::ul")):
                        list_benefits = job_benefit_element[0].xpath(".//li/text()")
                        if len(list_benefits) == 0:
                            list_benefits = job_benefit_element[0].xpath(".//strong/text()")
                        data["benefit"] = [re.sub(r'\xa0+', ' ', x) for x in list_benefits]
                    else:
                        list_benefits = job_benefit_element[0].xpath(".//p/text()")
                        data["benefit"] = [re.sub(r'\xa0+', ' ', x) for x in list_benefits]

            # Job requirement
            job_requirement_title = tree.xpath("*//h2[contains(text(), 'Yêu cầu công việc')]")
            if len(job_requirement_title):
                job_requirement_parent = job_requirement_title[0].getparent()
                job_requirement_element = job_requirement_parent.xpath("./descendant::div[@class='jsx-d84db6a84feb175e mb-2 text-14 break-words text-se-neutral-80 text-description']")
                if len(job_requirement_element):
                    if len(job_requirement_element[0].xpath("./descendant::ul")):
                        list_requirement = job_requirement_element[0].xpath(".//li/text()")
                        if len(list_requirement) == 0:
                            list_requirement = job_requirement_element[0].xpath(".//strong/text()")
                        data["requirement"] = [re.sub(r'\xa0+', ' ', x) for x in list_requirement]
                    else:
                        list_requirement = job_requirement_element[0].xpath(".//p/text()")
                        data["requirement"] = [re.sub(r'\xa0+', ' ', x) for x in list_requirement]

            # Job updated time
            post_time_element =  tree.xpath('.//p[contains(text(), "Ngày đăng")]/..//p[@class="text-14"]')
            if len(post_time_element):
                data["update_time"] = post_time_element[0].text_content()
            certificate_element =  tree.xpath('.//p[contains(text(), "Yêu cầu bằng cấp")]/..//p[@class="text-14"]')
            if len(certificate_element):
                data["certificate"] = certificate_element[0].text_content()

            group_location_element = tree.xpath(".//*[@class='jsx-d84db6a84feb175e text-primary font-medium pt-[1px] text-12']/text()")
            if len(group_location_element):
                data["location"] = group_location_element
            location_element = tree.xpath("*//h2[contains(text(), 'Địa điểm làm việc')]")
            if(len(location_element)):
                parent_element = location_element[0].getparent()
                location_element_container = parent_element.xpath("./descendant::span[@class='jsx-d84db6a84feb175e']")
                if(len(location_element_container)):
                    locations = []
                    for ele in location_element_container:
                        full_text = ''.join(ele.xpath('./text()'))      
                        sub_span_text = ele.xpath("./descendant::span[@class='jsx-d84db6a84feb175e text-primary font-medium pt-[1px] text-12']/text()")
                        if len(sub_span_text):
                            locations.append(f"{full_text}, {sub_span_text[0]}")
                        else:
                            locations.append(f"{full_text}")
                    data["location"] = locations
                        
        time.sleep(1)
    except Exception as e:
        print(e)
    finally:
        # print(data)
        return data

def run_crawler():
    count = 0
    today = datetime.now().strftime("%d/%m/%Y")
    temp_data = []
    clicked = False
    stop = False
    totalWrongData = 0
    for i in range (1, 50):
        if stop:
            break
        try:
            # https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?page=2&sort_q=actived_at_by_box%2Cdesc
            url = "https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?page="+ str(i)+ "&sort_q=actived_at_by_box%2Cdesc"
            driver.get(url)
            time.sleep(1)
            if not clicked:
                time.sleep(0.5)
                new_est_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Việc làm mới nhất')]")
                print(new_est_button)
                if new_est_button is not None:
                    new_est_button.click()
                    clicked = True
                    time.sleep(1)
            list_ele = driver.find_elements(By.XPATH, "//*[@class='lg:w-[77%] relative w-11/12 lg:mx-0 mx-auto py-3 md:py-0']/div[@class='relative lg:h-[115px] w-full flex rounded-sm lg:mb-3 mb-2 lg:hover:shadow-md']/a")
            if len(list_ele):
                for job_card in list_ele:
                    print(count)
                    url = job_card.get_attribute('href')
                    # url = 'https://vieclam24h.vn'+ url
                    # print(url)
                    data = getSpecificPage(url)
                    if any(data.values()):
                        job_time = data.get("update_time")
                        if job_time is None:
                            print("Not update_time")
                            # continue
                        elif(job_time != today):
                            totalWrongData += 1
                            print("Warning update_time (wrong "+ str(totalWrongData) +" times)="+ job_time)
                            if totalWrongData > 5:
                                print("Stop because update_time wrong > 5")
                                stop = True
                                break
                        else:
                            count += 1
                            temp_data.append(data)

            try:
                if len(temp_data):
                    with open('/home/chuot/data/vieclam24h.json', 'r', encoding='utf-8') as f:
                        existing_data = json.load(f)
                        existing_data.extend(temp_data)
                    with open('/home/chuot/data/vieclam24h.json', 'w', encoding='utf-8') as file:
                        json.dump(existing_data, file, indent=4, ensure_ascii=False)
                        print("Write sucess "+ str(len(temp_data)) + " jobs to file")
                        temp_data = []
            except Exception as e:
                print("Error when read/write file:" + str(e))

        except Exception as e:
            print("Error:" + str(e))
            continue 

def run_spark_job():
    spark = SparkSession.builder.master("local").appName("vieclam24h").getOrCreate()
    json_file_path = '/home/chuot/data/vieclam24h.json'
    # Read the JSON file into a DataFrame
    df = spark.read.option("multiline","true").json(json_file_path)
    df.dropDuplicates()
    df = df.filter(col("company").isNotNull())
    # Salary
    def parse_salary(salary):
        if salary is None:
            return {"type": 0 }
        elif (salary.strip().lower() == "thoả thuận" or salary.strip().lower() == "thỏa thuận"):
            return {"type": 3 }
        elif "triệu" in salary:
            salary = salary.replace(" triệu", "").replace(",", ".").strip()
            if "-" in salary:
                min_salary, max_salary = salary.split("-")
                return {"type": 1, "min": float(min_salary), "max": float(max_salary) }
            else:
                return {"type": 2, "fixed": float(salary)}
    # Age
    def parse_age(age):
        if age is None:
            return { "type": 0 }
        age = age.strip().lower()
        if "tuổi" in age:
            age = age.replace(" tuổi", "").strip()
            if "-" in age:
                min_age, max_age = age.split("-")
                return { "type": 1, "min": int(min_age), "max": int(max_age) }
            else:
                return { "type": 2, "value": int(age) }
        return { "type": 0 }

    # Experience
    def parse_experience(experience):
        if experience is None or experience == "Chưa có kinh nghiệm":
            return { "type": 0 }
        if "Dưới" in experience:
            strip_experience = experience.replace("Dưới", "").replace("năm", "").strip()
            max = strip_experience
            return { "type": 3, "max": int(max) }
        elif "Hơn" in experience:
            strip_experience = experience.replace("Hơn", "").replace("năm", "").strip()
            min = strip_experience
            return { "type": 4, "min": int(min) }
        else:
            fixed = experience.replace("năm", "").strip()
            return { "type": 2, "fixed": int(fixed)}
        return { "type": 0 }

    def parse_category(categories):
        if categories is None or len(categories) == 0:
            return []
        else :
            category_arr = []
            for category in categories:
                if category == 'Hành chính - Thư ký':
                    category_arr.append('hc_ql')
                elif category == 'Giáo dục - Đào tạo':
                    category_arr.append('gd_dt')
                elif category == 'Nghề nghiệp khác':
                    category_arr.append('other')
                elif category == 'Quản lý tiêu chuẩn và chất lượng' or category == 'Quản lý dự án':
                    category_arr.append('hc_ql')
                elif category == 'Thực tập sinh':
                    category_arr.append('other')
                elif category == 'Nông - Lâm - Ngư nghiệp':
                    category_arr.append('nn_ln_ts')
                elif category == 'An toàn lao động' or category == 'An ninh - Bảo vệ':
                    category_arr.append('at_an')
                elif category == 'Vận Tải - Lái xe - Giao nhận':
                    category_arr.append('vt')
                elif category == 'Bán sỉ - Bán lẻ - Quản lý cửa hàng':
                    category_arr.append('kd')
                elif category == 'Hóa học - Hóa sinh':
                    category_arr.append('kh_kt')
                elif category == 'IT Phần mềm':
                    category_arr.append('it')
                elif category == 'Tài chính - Đầu tư - Chứng Khoán' or category == 'Ngân hàng':
                    category_arr.append('tc_kt')
                elif category == 'Phân tích - Thống kê dữ liệu':
                    category_arr.append('pt_tk')
                elif category == 'Kiến trúc - Thiết kế nội ngoại thất':
                    category_arr.append('tk_kt_nt')
                elif category == 'Điện - Điện tử - Điện lạnh':
                    category_arr.append('cn_sx')
                elif category == 'Thực phẩm - Đồ uống':
                    category_arr.append('tp')
                elif category == 'Thiết kế - Sáng tạo nghệ thuật':
                    category_arr.append('tk_kt_nt')
                elif category == 'Sản xuất - Lắp ráp - Chế biến':
                    category_arr.append('cn_sx')
                elif category == 'Kế toán':
                    category_arr.append('tc_kt')
                elif category == 'Bất động sản':
                    category_arr.append('bds')
                elif category == 'Bán hàng - Kinh doanh':
                    category_arr.append('kd')
                elif category == 'Khoa học - Kỹ thuật':
                    category_arr.append('kh_kt')
                elif category == 'Thông tin - Truyền thông - Quảng cáo' or category == 'Marketing':
                    category_arr.append('tt_mkt')
                elif category == 'Dầu khí':
                    category_arr.append('cn_sx')
                elif category == 'Khách sạn - Nhà hàng - Du lịch':
                    category_arr.append('dv')
                elif category == 'Truyền hình - Báo chí - Biên tập':
                    category_arr.append('tt_mkt')
                elif category == 'Công nghệ thực phẩm - Dinh dưỡng':
                    category_arr.append('tp')
                elif category == 'Chăn nuôi - Thú y':
                    category_arr.append('nn_ln_ts')
                elif category == 'Xuất Nhập Khẩu':
                    category_arr.append('kd')
                elif category == 'Vận hành - Bảo trì - Bảo dưỡng':
                    category_arr.append('cn_sx')
                elif category == 'Dược phẩm':
                    category_arr.append('yt_sk')
                elif category == 'Nhân sự':
                    category_arr.append('hc_ql')
                elif category == 'Xây dựng':
                    category_arr.append('xd')
                elif category == 'Cơ khí - Ô tô - Tự động hóa':
                    category_arr.append('cn_sx')
                elif category == 'Xuất bản - In ấn':
                    category_arr.append('xb')
                elif category == 'Kiểm toán':
                    category_arr.append('tc_kt')
                elif category == 'Môi trường - Xử lý chất thải':
                    category_arr.append('cn_sx')
                elif category == 'IT Phần cứng - Mạng':
                    category_arr.append('it')
                elif category == 'Khai thác năng lượng - Khoáng sản - Địa chất':
                    category_arr.append('cn_sx')
                elif category == 'Biên phiên dịch':
                    category_arr.append('law')
                elif category == 'Bảo hiểm':
                    category_arr.append('law')
                elif category == 'Dệt may - Da giày - Thời trang':
                    category_arr.append('tk_kt_nt')
                elif category == 'Bưu chính viễn thông':
                    category_arr.append('dv')
                elif category == 'Chăm sóc khách hàng':
                    category_arr.append('dv')
                elif category == 'Lao động phổ thông':
                    category_arr.append('ldpt')
                elif category == 'Luật - Pháp Lý - Tuân thủ':
                    category_arr.append('law')
                elif category == 'Thu mua - Kho Vận - Chuỗi cung ứng':
                    category_arr.append('kd')
                elif category == 'Y tế - Chăm sóc sức khỏe':
                    category_arr.append('yt_sk')
                else:
                    print("None value match job category" + category)
            return category_arr
            
    # Type
    def get_type_job(type):
        if type == "Toàn thời gian cố định":
            return [0]
        elif type == "Bán thời gian cố định":
            return [2]
        elif type == "Toàn thời gian tạm thời":
            return [1]
        elif type == "Khác":
            return [5]
        else:
            return [0]

    # Certificate 
    # Type
    df = df.withColumn(
        "certificate",
        when(col("certificate") == None, 0)
        .when(col("certificate") == "Chứng chỉ", 1)
        .when(col("certificate") == "Trung học", 2)
        .when(col("certificate") == "Trung cấp", 3)
        .when(col("certificate") == "Cao đẳng", 4)
        .when(col("certificate") == "Đại học", 5)
        .when(col("certificate") == "Trên đại học", 6)
        .otherwise(0)
    )

    # Sex
    df = df.withColumn(
        "sex",
        when(col("sex") == "Nam", 1)
        .when(col("sex") == "Nữ", 2)
        .otherwise(0)
    )

    df = df.dropDuplicates(["url"])

    # Expiration
    df = df.withColumn("expiration", date_format(to_timestamp(concat(col("expiration"), lit(" 00:00:00")), "dd/MM/yyyy HH:mm:ss"), "yyyy-MM-dd HH:mm:ss"))

    # Update at
    df = df.withColumn("update_time", date_format(to_timestamp(concat(col("update_time"), lit(" 00:00:00")), "dd/MM/yyyy HH:mm:ss"), "yyyy-MM-dd HH:mm:ss"))

    # Role
    def classify_role(role):
        if role == "Chuyên viên- nhân viên":
            return 0
        elif role == "Quản lý cấp cao" or role == "Quản lý cấp trung":
            return 1
        elif role == "Cộng tác viên":
            return 6
        elif role == "Quản lý nhóm- giám sát":
            return 5
        elif role == "Chuyên gia":
            return 7
        else:
            return 0
    classify_role_udf = udf(classify_role, IntegerType())
    df = df.withColumn("role", classify_role_udf(col("role")))

    def clean_description(description):
        if description is None:
            return []
        # Filter out empty strings and None values
        cleaned_descriptions = [desc for desc in description if desc is not None and len(desc.strip())> 0]
        # Apply cleaning to filtered descriptions
        cleaned_descriptions = [re.sub(r'^[\-\•\d\.\s]+', '', desc).strip() for desc in cleaned_descriptions]
        return cleaned_descriptions
    clean_description_udf = udf(clean_description, ArrayType(StringType()))
    df = df.withColumn("description", clean_description_udf(col("description")))
    df = df.withColumn("benefit", clean_description_udf(col("benefit")))
    df = df.withColumn("requirement", clean_description_udf(col("requirement")))

    def getProvince(province):
        if province == "An Giang": 
            location = "AG"
        
        elif province == "Bà Rịa - Vũng Tàu": 
            location = "BV"
        
        elif province == "Bạc Liêu": 
            location = "BL"
        
        elif province == "Bắc Kạn": 
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
        
        elif province == "Đắk Lắk": 
            location = "DL"
        
        elif province == "Đắk Nông": 
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
        
        elif province == "TP.HCM" : 
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
        
        elif province == "Thừa Thiên Huế": 
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
            # print("No match:\""+ province+ "\"")
            location = 'other'
        return location

    # location
    def normalize_location(locations):
        arr = []
        if locations is None:
            return []
        for location in locations:
            if ("xem thêm" in location):
                continue
            if location is None:
                continue
            parts = [part.strip() for part in location.split(',')]
            if len(parts) >= 2:
                province = parts[-1]
                district = parts[-2]
                address = ', '.join(parts[:-2])
                province_final = getProvince(province)
                arr.append({"province": getProvince(province), "district": district, "address": address})
            elif len(parts) == 1:
                province_final = getProvince(parts[-1])
                arr.append ({"province": province_final, "district": None, "address": None })
        return arr
        
    rdd = df.rdd.map(lambda row: {
        **row.asDict(),
        "salary": parse_salary(row["salary"]),
        "age": parse_age(row["age"]),
        "location": normalize_location(row["location"]),
        "experience": parse_experience(row["experience"]),
        "field": parse_category(row["category"]),
        "type": get_type_job(row["type"])
    })


    client = pymongo.MongoClient("mongodb://localhost:27017/", username='admin', password='20194856')
    db = client["thesis"]
    collection = db["jobs"]

    existing_data = list(collection.find({}, {"company": 1, "title": 1})) 
    print(len(existing_data))
    similarity_threshold = 80  # Adjust as needed

    # Function to check similarity
    def check_similarity(new_record, existing_records):
        for existing_record in existing_records:
            similarity_title = fuzz.ratio(new_record["title"], existing_record["title"])
            similarity_company = fuzz.ratio(new_record["company"], existing_record["company"])
            if similarity_title >= similarity_threshold or similarity_company >= similarity_threshold:
                return True  # Found a match above threshold
        return False  # No matches above threshold

    # # Filter RDD to exclude duplicates
    rdd = rdd.filter(lambda record: not check_similarity(record, existing_data))
    rdd.count()
    print("Need to insert " + str(rdd.count()) + " jobs to DB")

    def insert_into_mongodb(partition):
        client = pymongo.MongoClient("mongodb://localhost:27017/", username='admin', password='20194856')
        db = client["thesis"]
        collection = db["jobs"]

        for record in partition:
            collection.insert_one(record)

    # Insert dữ liệu vào collection "jobs"
    rdd.foreachPartition(insert_into_mongodb)
    print("Inserted" + str(rdd.count()) + "jobs to DB")
    print("ETL Job")

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 7, 6),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}
dag = DAG(
    'vieclam24h',
    default_args=default_args,
    description='DAG for vieclam24hjob',
    schedule_interval=timedelta(days=1),
)


crawler_task = PythonOperator(
    task_id='run_crawler_vieclam24h',
    python_callable=run_crawler,
    dag=dag,
)

spark_job_task = PythonOperator(
    task_id='run_spark_job_vieclam24h',
    python_callable=run_spark_job,
    dag=dag
)
crawler_task >> spark_job_task
