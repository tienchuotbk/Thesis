import requests
from lxml import html
import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
import time

service = Service(executable_path=r'/usr/bin/chromedriver')
options = webdriver.ChromeOptions()
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
    "order": [],
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
def getRequiremnet(string):
    paragraphs = []
    soup = BeautifulSoup(string, 'lxml')

    # Iterate over the <p> tags
    for p in soup.find_all('p'):
        strong_tag = p.find('strong')
        if not strong_tag:
            # Only add content that does not contain a <strong> tag
            content = p.get_text(strip=True)
            if content:  # Only add non-empty content
                paragraphs.append(content)
    return paragraphs

def getPageContent(id):
    data = {}
    url = 'https://www.vietnamworks.com/job--'+  str(id) + "-jv?source=searchResults&searchType=2&placement="+ str(id) + "&sortBy=date"
    try:
        driver.get(url)
        time.sleep(2)
        # WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "sc-4dcd9b5d-0 fIdBXj")))
        job_title_element = driver.find_elements(By.CSS_SELECTOR, "#vnwLayout__col > h1")
        # for job in jobs:
        #     print(job.text)
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
                    title = benefit.find_element(By.XPATH, ".//p[@class='sc-28f2b301-64 fDnMuU']")
                    if title: 
                        text_benefit += title.text
                    sub_title = benefit.find_element(By.XPATH, ".//div[@class='sc-c683181c-2 fGxLZh']")
                    if sub_title: 
                        text_benefit += ": " + sub_title.text
                    text_benefits.append(text_benefit)
                data["benefit"] = text_benefits
        data["crawl_time"] = today
        
    except Exception as e:
        print(e)
        return data
    # print(data)
    return data
try: 
    count = 0
    final_data = []
    for i in range(120, 150):
        body["page"] = i
        print("Page "+ str(i))
        response = requests.post('https://ms.vietnamworks.com/job-search/v1.0/search', json=body)

        if response.status_code == 200:
            list_data = response.json()["data"]
            ids = [item["jobId"] for item in list_data]
            for id in ids:
                print(count)
                data = getPageContent(id)
                if len(data):
                    final_data.append(data)
                    count += 1
                    
        else:
            print("Error")
        try:
            with open('vietnamwork.json', 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                existing_data.extend(final_data)
            with open('vietnamwork.json', 'w', encoding='utf-8') as file:
                json.dump(existing_data, file, indent=4, ensure_ascii=False)
                final_data = []
        except Exception as e:
            print(e)
except Exception as e:
    print(e)


    