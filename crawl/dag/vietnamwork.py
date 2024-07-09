from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
import requests
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

import findspark
findspark.init('/opt/spark')  # Adjust the path if Spark is installed elsewhere

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, expr, date_format, udf, to_date, when, regexp_extract, explode, col, regexp_replace, to_timestamp, concat, lit, array, trim
from pyspark.sql.types import StructType, StructField, IntegerType, FloatType, StringType, ArrayType
from rapidfuzz import fuzz 
import re
import pymongo
json_file_path = '/home/chuot/data/vietnamwork.json'

service = Service(executable_path=r'/usr/bin/chromedriver')
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_experimental_option(
    "prefs", {
        # block image loading
        "profile.managed_default_content_settings.images": 2,
    }
)
driver = webdriver.Chrome(service=service, options=options)
body = {
    "userId": 0,
    "query": "",
    "filter": [],
    "ranges": [],
    "order": [
        {
            "field": "approvedOn",
            "value": "desc"
        }
    ],
    "hitsPerPage": 50,
    "page": 0,
    "retrieveFields": [
        "address",
        "benefits",
        "jobTitle",
        "salaryMax",
        "isSalaryVisible",
        "jobLevelVI",
        "isShowLogo",
        "salaryMin",
        "companyLogo",
        "userId",
        "jobLevel",
        "jobLevelId",
        "jobId",
        "jobUrl",
        "companyId",
        "approvedOn",
        "isAnonymous",
        "alias",
        "expiredOn",
        "industries",
        "workingLocations",
        "services",
        "companyName",
        "salary",
        "onlineOn",
        "simpleServices",
        "visibilityDisplay",
        "isShowLogoInSearch",
        "priorityOrder",
        "skills",
        "profilePublishedSiteMask",
        "jobDescription",
        "jobRequirement",
        "prettySalary",
        "requiredCoverLetter",
        "languageSelectedVI",
        "languageSelected",
        "languageSelectedId"
    ]
}
today = datetime.now().strftime("%d/%m/%Y")

def getPageContent(id):
    data = {}
    url = 'https://www.vietnamworks.com/job--'+  str(id) + "-jv?source=searchResults&searchType=2&placement="+ str(id) + "&sortBy=date"
    try:
        driver.get(url)
        time.sleep(1.5)
        job_title_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > h1")
        data["id"] = id
        data["url"] = url
        if len(job_title_element):
            data["title"] = job_title_element[0].text
            
        job_salary_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > div > div.sc-37577279-0.joYsyf > div.sc-37577279-3.drWnZq > a")
        if len(job_salary_element):
            data["company"] = job_salary_element[0].text
        job_salary_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > span")
        if len(job_salary_element):
            data["salary"] = job_salary_element[0].text
        job_group_title_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > div > span")
        if len(job_group_title_element):
            data["expiration"] = job_group_title_element[0].text
        if len(job_group_title_element) >= 3:
            data["province"] = job_group_title_element[2].text
        job_create_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > div > div.sc-7bf5461f-2.JtIju > p")
        if len(job_create_element):
            data["update_time"] = job_create_element[0].text
        # job_role_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > div > div.sc-7bf5461f-2.JtIju > p")
        # if len(job_role_element):
        if len(job_create_element) >= 2:
            data["role"] = job_create_element[1].text
        job_category_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > div > div.sc-7bf5461f-2.JtIju > p > span:nth-child(1)")
        if len(job_category_element):
            data["category"] = job_category_element[0].text
        job_field_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > div > div.sc-7bf5461f-2.JtIju > p > span")
        if len(job_field_element):
            data["field"] = job_field_element[2].text
        job_exp_element = driver.find_elements(By.XPATH, "//label[contains(text(), 'SỐ NĂM KINH NGHIỆM TỐI THIỂU')]/../p")
        if len(job_exp_element):
            data["experience"] = job_exp_element[0].text
        
        show_des_button = driver.find_element(By.XPATH, "//button[@aria-label='Xem đầy đủ mô tả công việc']")
        if show_des_button:
            show_des_button.click()
            time.sleep(0.5)

        button = driver.find_element(By.XPATH, "//button[@aria-label='Xem thêm']")
        if button:
            button.click()
            time.sleep(0.2)
        job_level_element = driver.find_elements(By.XPATH, "//label[contains(text(), 'TRÌNH ĐỘ HỌC VẤN TỐI THIỂU')]/../p")
        if len(job_level_element):
            data["certificate"] = job_level_element[0].text
        job_sex_element = driver.find_elements(By.XPATH, "//label[contains(text(), 'GIỚI TÍNH')]/../p")
        if len(job_sex_element):
            data["sex"] = job_sex_element[0].text
        job_age_element = driver.find_elements(By.XPATH, "//label[contains(text(), 'ĐỘ TUỔI MONG MUỐN')]/../p")
        if len(job_age_element):
            data["age"] = job_age_element[0].text
        
        job_location_elements = driver.find_elements(By.XPATH, "//h2[contains(text(), 'Địa điểm làm việc')]/..//p")
        if len(job_location_elements):
            job_locations = []
            for location in job_location_elements:
                job_locations.append(location.text)
            data["location"] = job_locations
            
        logo_element = driver.find_element(By.XPATH, "//*[@id='vnwLayout__col']/div/div[1]/div[1]/div[2]/span/img")
        if logo_element:
            data["logo"] = logo_element.get_attribute('src')
        
        job_des_element = driver.find_elements(By.XPATH, "//h2[contains(text(), 'Mô tả công việc')]/..//p")
        if len(job_des_element):
            des_text = []
            for job_des in job_des_element:
                des_text.append(job_des.text)
            data["description"] = des_text
        
        job_requirement_element = driver.find_elements(By.XPATH, "//h2[contains(text(), 'Yêu cầu công việc')]/..//p")
        if len(job_requirement_element):
            requirement_text = []
            for jobr in job_requirement_element:
                requirement_text.append(jobr.text)
            data["requirement"] = requirement_text
        
        job_benefit_element = driver.find_elements(By.XPATH, "//h2[contains(text(), 'Các phúc lợi dành cho bạn')]/..")
        if len(job_benefit_element):
            benefit_element = job_benefit_element[0]
            group_benefit = benefit_element.find_elements(By.XPATH, ".//*[@id='vnwLayout__col']/div")
            if len(group_benefit):
                text_benefits = []
                for benefit in group_benefit:
                    text_benefit = ''
                    title = benefit.find_element(By.XPATH, ".//p[@name='title']")
                    if title is not None: 
                        text_benefit += title.text
                    sub_title = benefit.find_element(By.XPATH, ".//div[@class='sc-c683181c-2 fGxLZh']")
                    if sub_title is not None: 
                        text_benefit += ": " + sub_title.text
                    text_benefits.append(text_benefit)
                data["benefit"] = text_benefits

        data["crawl_time"] = today
        
    except Exception as e:
        print(e)
        return data
    return data

def run_crawler():
    current_date = datetime.now().strftime("%d/%m/%Y")
    count = 0
    final_data = []
    stop = False
    totalWrongData = 0
    for i in range(1, 50):
        if stop:
            break
        body["page"] = i
        print("Page "+ str(i))
        response = requests.post('https://ms.vietnamworks.com/job-search/v1.0/search', json=body)

        if response.status_code == 200:
            list_data = response.json()["data"]
            ids = [item["jobId"] for item in list_data]
            for id in ids:
                print(count)
                data = getPageContent(id)
                if any(data.values()):
                    job_time = data.get("update_time")
                    print(job_time)
                    if job_time is None:
                        print("Not update_time")
                        # continue
                    elif(job_time == current_date or job_time == '08/07/2024' or job_time == '07/07/2024'):
                        final_data.append(data)
                        count += 1
                    else:
                        print("Warning update_time (wrong "+ str(totalWrongData) +" times)="+ job_time)
                        # print("url"+ data.get("url"))
                        totalWrongData += 1
                        if totalWrongData > 100:
                            print("Stop because update_time wrong > 5")
                            stop = True
                            break
                        
                    
        else:
            print("Error")
        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                existing_data.extend(final_data)
            with open(json_file_path, 'w', encoding='utf-8') as file:
                json.dump(existing_data, file, indent=4, ensure_ascii=False)
                final_data = []
        except Exception as e:
            print(e)
    
    pass
def run_spark_job():
    spark = SparkSession.builder.master("local").appName("vietnamwork").getOrCreate()
    df = spark.read.option("multiline", "true").json(json_file_path)
    df.dropDuplicates()
    df = df.filter(col("company").isNotNull())
    # Salary
    def parse_salary(salary):
        vnd_per_usd = 25
        if salary is None:
            return {"type": 0}
        elif salary == "Thương lượng":
            return {"type": 3}
        elif "$" in salary:
            salary = salary.replace("/tháng", "")
            # salary = salary.replace("$", "").replace(",", ".").strip()
            if "-" in salary:
                min_salary, max_salary = salary.split("-")
                min_salary = min_salary.replace("$", "").strip()
                max_salary = max_salary.replace("$", "").strip()
                min_salary = float(min_salary.replace(",", ""))
                max_salary = float(max_salary.replace(",", ""))
                if (min_salary > 10000 or max_salary > 10000):
                    return {
                    "type": 1,
                    "min": min_salary / 1000,
                    "max": max_salary / 1000,
                    }
                return {
                    "type": 1,
                    "min": min_salary * vnd_per_usd / 1000,
                    "max": max_salary * vnd_per_usd / 1000,
                }
            elif "Tới" in salary:
                max_salary = salary.replace("Tới", "").replace("$", "").strip()
                return {"type": 4, "max": float(max_salary.replace(",", "")) * vnd_per_usd / 1000}
            elif "Từ" in salary:
                min_salary = salary.replace("Từ", "").replace("$", "").strip()
                return {"type": 3, "max": float(min_salary.replace(",", "")) * vnd_per_usd / 1000}
            else:
                fixed_value = salary.replace("$", "").strip()
                return {"type": 2, "fixed": float(fixed_value.replace(",", "")) * vnd_per_usd / 1000}


    # Age
    def parse_age(age):
        if age is None or age == "Không giới hạn" or age == "Không hiển thị":
            return {"type": 0}
        age = age.strip()
        if "tuổi" in age:
            age = age.replace("tuổi", "").replace("Dưới", "").strip()
            return {"type": 3, "max": int(age)}
        elif "-" in age:
            min_age, max_age = age.split("-")
            return {"type": 1, "min": int(min_age), "max": int(max_age)}
        return {"type": 0}


    # Experience
    def parse_experience(experience):
        if (
            experience is None
            or experience == "Không yêu cầu"
            or experience == "Không hiển thị"
        ):
            return {"type": 0}
        else:
            fixed = experience.strip()
            return {"type": 2, "fixed": int(fixed)}
        # return { "type": 0 }


    # Type
    def parseType():
        return [0]


    # Type
    df = df.withColumn(
        "certificate",
        when(col("certificate") == None, 0)
        .when(col("certificate") == "Chứng chỉ", 1)
        .when(col("certificate") == "Trung học", 2)
        .when(col("certificate") == "Trung cấp", 3)
        .when(col("certificate") == "Cao đẳng", 4)
        .when(col("certificate") == "Cử nhân", 5)
        .when(col("certificate") == "Tiến sĩ", 6)
        .when(col("certificate") == "Thạc Sĩ", 6)
        .otherwise(0),
    )

    # Sex
    df = df.withColumn(
        "sex", when(col("sex") == "Nam", 1).when(col("sex") == "Nữ", 2).otherwise(0)
    )

    days_pattern = r"Hết hạn trong (\d+) ngày"
    df = df.withColumn(
        "days_to_add", regexp_extract(col("expiration"), days_pattern, 1).cast("int")
    )
    df = df.withColumn("update_time", to_date(col("update_time"), "dd/MM/yyyy"))
    df = df.withColumn("expiration", expr("date_add(update_time, days_to_add)"))

    # Expiration
    # df = df.withColumn("expiration", date_format(col("expiration"), "yyyy-MM-dd HH:mm:ss").cast("timestamp"))
    df = df.withColumn(
        "expiration", date_format(to_timestamp(col("expiration")), "yyyy-MM-dd HH:mm:ss")
    )
    # Update at
    df = df.withColumn(
        "update_time", date_format(to_timestamp(col("update_time")), "yyyy-MM-dd HH:mm:ss")
    )
    df = df.drop(col("days_to_add"))
    df = df.drop(col("crawl_time"))
    df = df.drop(col("id"))

    # Description
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

    # Role
    def classify_role(role):
        if role == "Nhân viên" or role == "Fresher/Entry level":
            return 0
        elif role == "Giám Đốc và Cấp Cao Hơn":
            return 2
        elif role == "Cộng tác viên":
            return 6
        elif role == "Trưởng phòng":
            return 5
        elif role == "Thực tập sinh/Sinh viên" or role == "Mới Tốt Nghiệp":
            return 4
        else:
            return 0


    classify_role_udf = udf(classify_role, IntegerType())
    df = df.withColumn("role", classify_role_udf(col("role")))


    def getProvince(province):
        if province == "An Giang":
            location = "AG"

        elif province == "Bà Rịa - Vũng Tàu":
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

        elif province == "Đắk Nông" or province == "Dak Nông":
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

        elif province == "Hồ Chí Minh" or province == "TP.HCM":
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
            # print("No match:\""+ province+ "\"")
            location = "other"
        return location


    # location
    def normalize_location(provinces, locations):
        arr = []
        if provinces == None or locations == None:
            return []
        provinces = provinces.split(",")
        for province, location in zip(provinces, locations):
            parts = [part.strip() for part in location.split(",") if part.strip()]
            province = province.strip()
            if len(parts) >= 2:
                job_province = parts[-1]
                district = None
                if job_province == province:
                    district = parts[-2]
                else:
                    district = [
                        address
                        for address in parts
                        if "huyện" in address.lower()
                        or "Q." in address
                        or "Quận" in address.lower()
                    ]
                arr.append(
                    {
                        "province": getProvince(province),
                        "district": district,
                        "address": location,
                    }
                )
            else:
                arr.append(
                    {
                        "address": location,
                        "district": None,
                        "province": getProvince(province),
                    }
                )
        return arr


    df = df.withColumn("field", array(col("category"), col("field")))

    category_mapping = {
        "Kế Toán/Kiểm Toán": "tc_kt",
        "Bảo Hiểm": "dv",
        "Khác": "other",
        "Công Nghệ Thông Tin/Viễn Thông": "it",
        "Dệt May/Da Giày": "cn_sx",
        "Banking & Financial Services": "tc_kt",
        "Thiết Kế": "tk_kt_nt",
        "Kỹ Thuật": "kh_kt",
        "Nhân Sự/Tuyển Dụng": "hc_ql",
        "Pháp Lý": "law",
        "Dịch Vụ Ăn Uống": "tp",
        "Nghệ thuật, Truyền thông/In ấn/Xuất bản": "xb",
        "Chính Phủ/Phi Lợi Nhuận": "other",
        "Hậu Cần/Xuất Nhập Khẩu/Kho Bãi": "vt",
        "Kinh Doanh": "kd",
        "Y Tế/Chăm Sóc Sức Khoẻ": "yt_sk",
        "Vận Tải": "vt",
        "Bán Lẻ/Tiêu Dùng": "kd",
        "Hành Chính Văn Phòng": "hc_ql",
        "Ngân Hàng & Dịch Vụ Tài Chính": "tc_kt",
        "Kiến Trúc/Xây Dựng": "xd",
        "Tiếp Thị, Quảng Cáo/Truyền Thông": "tt_mkt",
        "Dịch Vụ Khách Hàng": "dv",
        "CEO & General Management": "hc_ql",
        "Nông/Lâm/Ngư Nghiệp": "nn_ln_ts",
        "Sản Xuất": "cn_sx",
        "Nhà Hàng - Khách Sạn/Du Lịch": "dv",
        "Khoa Học & Kỹ Thuật": "kh_kt",
        "Giáo Dục": "gd_dt",
        "Dược": "yt_sk",
        "Cung cấp nhân lực": "hc_ql",
        "Bất Động Sản": "bds",
    }


    def parse_category(categorie):
        if categorie is None:
            return []
        else:
            field = category_mapping[categorie]
            if field is not None:
                return [field]
            else:
                return ["other"]


    rdd = df.rdd.map(
        lambda row: {
            **row.asDict(),
            "salary": parse_salary(row["salary"]),
            "age": parse_age(row["age"]),
            "location": normalize_location(row["province"], row["location"]),
            "experience": parse_experience(row["experience"]),
            "type": parseType(),
            "field": parse_category(row["category"]),
            "category": row["field"],
        }
    )
    # client = pymongo.MongoClient(
    #     "mongodb://localhost:27017/", username="admin", password="20194856"
    # )
    # db = client["thesis"]
    # collection = db["jobs"]

    # existing_data = list(collection.find({}, {"company": 1, "title": 1}))
    # print(len(existing_data))
    # similarity_threshold = 80  # Adjust as needed

    # Function to check similarity
    # def check_similarity(new_record, existing_records):
    #     for existing_record in existing_records:
    #         similarity_title = fuzz.ratio(new_record["title"], existing_record["title"])
    #         similarity_company = fuzz.ratio(
    #             new_record["company"], existing_record["company"]
    #         )
    #         if (
    #             similarity_title >= similarity_threshold
    #             or similarity_company >= similarity_threshold
    #         ):
    #             return True  # Found a match above threshold
    #     return False  # No matches above threshold


    # Filter RDD to exclude duplicates
    # rdd = rdd.filter(lambda record: not check_similarity(record, existing_data))
    # rdd.count()


    def insert_into_mongodb(partition):
        client = pymongo.MongoClient(
            "mongodb://localhost:27017/", username="admin", password="20194856"
        )
        db = client["thesis"]
        collection = db["jobs"]

        for record in partition:
            try:
                collection.insert_one(record)
            except Exception as e:
                print(e)


    # # Insert dữ liệu vào collection "jobs"
    rdd.foreachPartition(insert_into_mongodb)
    print("Add sucess "+ str(rdd.count()) + "jobs to DB.")
    spark.stop()

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
    'vietnamwork',
    default_args=default_args,
    description='DAG for vietnamwork',
    schedule_interval=timedelta(days=1),
)


crawler_task = PythonOperator(
    task_id='run_crawler_vietnamwork',
    python_callable=run_crawler,
    dag=dag,
)

spark_job_task = PythonOperator(
    task_id='run_spark_job_vietnamwork',
    python_callable=run_spark_job,
    dag=dag
)
crawler_task >> spark_job_task