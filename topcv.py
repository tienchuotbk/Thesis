from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
from lxml import html
import time
import random

service = Service(executable_path=r'/usr/bin/chromedriver')
options = webdriver.ChromeOptions()
options.add_argument('--disable-dev-shm-usage')
options.add_experimental_option(
    "prefs", {
        # block image loading
        "profile.managed_default_content_settings.images": 2,
    }
)


#driver = webdriver.Chrome(service=service, options=options)

user_agents = [
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
# Add more User-Agent strings as needed
]
def crawl_product_page(url):
    random_user_agent = random.choice(user_agents)
    response = requests.get(url, headers = {'User-agent': random_user_agent})
    if response.status_code == 200:
        tree = html.fromstring(response.content)
        print('-------------')
        title_elemet = tree.xpath('//*[@id="header-job-info"]/h1')
        if(len(title_elemet)):
            title = title_elemet[0].text_content()
            print("Title:"+ title.strip())
        else:
            print(f"Cannot get title {url}")
        salary_elemet = tree.xpath('//*[@id="header-job-info"]/div[@class="job-detail__info--sections"]/div[1]/div[@class="job-detail__info--section-content"]/div[@class="job-detail__info--section-content-value"]')
        if(len(salary_elemet)):
            salary = salary_elemet[0].text_content()
            print("Salary:"+salary)
        else:
            print(f"Cannot get salary {url}")

        experience_elemet = tree.xpath('//*[@id="job-detail-info-experience"]/div[@class="job-detail__info--section-content"]/div[@class="job-detail__info--section-content-value"]')
        if(len(experience_elemet)):
            experience = experience_elemet[0].text_content()
            print("Experience:"+ experience)
        else:
            print(f"Cannot get Experience {url}")

        group_general_info = tree.xpath('//*[@id="job-detail"]//div[@class="box-general-content"]')
        if(len(group_general_info)):
            group_general_info_element = group_general_info[0]
            position_element = group_general_info_element.xpath('.//div[@class="box-general-group"]//div[@class="box-general-group-info-value"]')
            if(len(position_element)):
                position = position_element[0].text_content()
                print("Position:"+ position)
                type_of_job = position_element[3].text_content()
                print("Type:"+ type_of_job)
                sex = position_element[4].text_content()
                print("Sex:"+ sex)
            else:
                print("Not get position")
        else:
            print(f"Cannot get Group Info {url}")
        print('-------------')
        
    else:
        print(response)
        # time.sleep(2)
    pass
try:
    driver = webdriver.Chrome(service=service, options=options)
    baseUrl = "https://www.topcv.vn/tim-viec-lam-moi-nhat?page="
    count = 0
    urls = []
    for i in range(1, 2):
        driver.get("https://www.topcv.vn/tim-viec-lam-moi-nhat?page="+ str(i))
        WebDriverWait(driver,10).until(EC.presence_of_element_located((By.CLASS_NAME, "box-job-list")))
        jobs = driver.find_elements(By.CLASS_NAME, "job-item-search-result")


        for job in jobs:
            count += 1
            url = job.find_element(By.CSS_SELECTOR, "div.body> div.body-content > div > div:nth-child(1) > h3 > a").get_attribute("href")
            print (f"#{count: 03d}")
            print(f"URL: {url}")
            print('---------')
            urls.append(url)
   
    for url in urls:
        crawl_product_page(url)
        pass
       
except Exception as e:
    print(e)
finally:
    driver.quit()

