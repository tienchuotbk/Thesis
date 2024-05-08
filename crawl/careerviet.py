import requests
from lxml import html
import time
import re

user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
def getSpecificPage(url):
    data = {}
    try:
        response = requests.get(url, headers={'User-agent': user_agent })
        if response.status_code == 200:
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
            group_infor = tree.xpath("//*[@class='detail-box has-background']/ul/li/p")
            if len(group_infor) == 7:
                data["salary"] = group_infor[3].text_content()
                data["role"] = group_infor[5].text_content()
                data["type"] = group_infor[2].text_content()
                data["experience"] = re.sub(r'\s+', ' ', group_infor[4].text_content().strip())
            location_element = tree.xpath("//*[@class='map']/p")
            if len(location_element):
                data["location"] = location_element[0].text_content()
            # detail-box has-background
        time.sleep(1)
    except Exception as e:
        print(e)
    finally:
        print(data)
        pass

try:
    count = 0
    temp_data = []
    for i in range (1, 2):
        url = "https://careerviet.vn/viec-lam/tat-ca-viec-lam-trang-"+ str(i)+"-vi.html"

        response = requests.get(url, headers={'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'})

        # Parsing the HTML content
        tree = html.fromstring(response.content)

        # Extracting the title element using XPath
        list_a = tree.xpath('//div[@class="jobs-side-list"]//h2/a')
        for a in list_a:
            job_url = a.get("href")
            print(job_url)
            count += 1
            print(count)
            data = getSpecificPage(job_url)

        
except Exception as e:
    print(e)
finally:
    pass