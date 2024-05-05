import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
from lxml import html
import time
import random

# import undetected_chromedriver as uc
# driver = uc.Chrome()

service = Service(executable_path=r'/usr/bin/chromedriver')
options = webdriver.ChromeOptions()
# options.add_argument('--disable-dev-shm-usage')
# options.add_argument("--headless") 
options.add_experimental_option(
    "prefs", {
        # block image loading
        "profile.managed_default_content_settings.images": 2,
    }
)

user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
    # Add more User-Agent strings as needed
]

def crawl_product_page(url):
    random_user_agent = random.choice(user_agents)
    response = requests.get(url, headers={'User-agent': random_user_agent})
    if response.status_code == 200:
        tree = html.fromstring(response.content)
        data = {}
        title_elemet = tree.xpath('//*[@id="header-job-info"]/h1')
        if title_elemet:
            data['title'] = title_elemet[0].text_content().strip()
        salary_elemet = tree.xpath('//*[@id="header-job-info"]/div[@class="job-detail__info--sections"]/div[1]/div[@class="job-detail__info--section-content"]/div[@class="job-detail__info--section-content-value"]')
        if salary_elemet:
            data['salary'] = salary_elemet[0].text_content()
        experience_elemet = tree.xpath('//*[@id="job-detail-info-experience"]/div[@class="job-detail__info--section-content"]/div[@class="job-detail__info--section-content-value"]')
        if experience_elemet:
            data['experience'] = experience_elemet[0].text_content()
        group_general_info = tree.xpath('//*[@id="job-detail"]//div[@class="box-general-content"]')
        if group_general_info:
            group_general_info_element = group_general_info[0]
            position_element = group_general_info_element.xpath('.//div[@class="box-general-group"]//div[@class="box-general-group-info-value"]')
            if position_element:
                data['position'] = position_element[0].text_content()
                data['type_of_job'] = position_element[3].text_content()
                data['sex'] = position_element[4].text_content()
        group_job_category = tree.xpath('//div[@class="job-detail__box--right job-detail__body-right--item job-detail__body-right--box-category"]//div[@class="box-category-tags"]/a/text()')
        data['category'] = group_job_category

        group_job_location = tree.xpath('//div[@class="job-detail__box--right job-detail__body-right--item job-detail__body-right--box-category"]//div[@class="box-category-tags"]/span/a/text()')
        data['location'] = group_job_location
        if any(data.values()):
            return data
    elif(response.status_code == 429): 
        # time.sleep(2)
        print("429")
    else:
        print(response)
    # time.sleep(1)
    return None

def getListUrl(driver, count):
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "box-job-list")))
    jobs = driver.find_elements(By.CLASS_NAME, "job-item-search-result")
    dataJobs = []
    print(len(jobs))
    for job in jobs:
        count += 1
        url = job.find_element(By.CSS_SELECTOR, "div.body> div.body-content > div > div:nth-child(1) > h3 > a").get_attribute("href")
        print (f"#{count: 03d}")
        # print(f"URL: {url}")
        data = crawl_product_page(url)
        if data:
            print(data)
            dataJobs.append(data)
        print('---------')
    return dataJobs    


try:
    driver = webdriver.Chrome(service=service, options=options)
    baseUrl = "https://www.topcv.vn/tim-viec-lam-moi-nhat?page="
    data = []
    try:
        index = 1
        driver.get("https://www.topcv.vn/tim-viec-lam-moi-nhat?page=1")
        time.sleep(1)
        count = 0
        next_button = None
        
        while True:
            jobData = getListUrl(driver, count)
            if(jobData):
                data.append(jobData)
            index += 1
            if(index == 1):
                WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[@id='main']/div[1]/div[5]/div[2]/div/div/div[3]/div[1]/div/div[1]/nav/ul/li[3]")))
            next_button_list = driver.find_elements(By.XPATH, "//*[@id='main']/div[1]/div[5]/div[2]/div/div/div[3]/div[1]/div/div[1]/nav/ul/li[3]")
            if(len(next_button_list) != 0):
                next_button = next_button_list[0]

            if(next_button is None):
                print("No button len:"+ str(index))
                break
            elif("disabled" in next_button.get_attribute("class")):
                print("Button disable!")
                break
            elif(index == 4):
                print("Stop by user set index")
                break
            else:
                print("has button")
                print(str(next_button))
                next_button.click()
                time.sleep(5)

        with open('output.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    except Exception as e:
        print(e)

except Exception as e:
    print(e)
finally:
    driver.quit()
