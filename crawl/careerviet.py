import requests
from lxml import html
import time
import re
import json

user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
def getSpecificPage(url):
    data = {}
    try:
        response = requests.get(url, headers={'User-agent': user_agent })
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
            group_infor = tree.xpath("//*[@class='detail-box has-background']/ul/li/p")
            if len(group_infor) == 7:
                data["salary"] = group_infor[3].text_content()
                data["role"] = group_infor[5].text_content()
                data["type"] = group_infor[2].text_content()
                data["experience"] = re.sub(r'\s+', ' ', group_infor[4].text_content().strip())
                data["expriration"] = group_infor[-1].text_content()
            elif len(group_infor) == 6:
                data["salary"] = group_infor[3].text_content()
                data["role"] = group_infor[4].text_content()
                data["type"] = group_infor[2].text_content()
                data["expriration"] = group_infor[-1].text_content()
            location_element = tree.xpath("//*[@class='map']/p")
            if len(location_element):
                data["location"] = location_element[0].text_content()
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
            job_des_element = tree.xpath("//*[@class='detail-row reset-bullet']/p")
            if(len(job_des_element)):
                arr = []
                for des in job_des_element:
                    arr.append(des.text_content().replace("\xa0", ""))
                data["description"] = arr
            job_require_element = tree.xpath("//div[@class='detail-row'][@reset-bullet]/p")
            if(len(job_require_element)):
                arr = []
                for req in job_require_element:
                    arr.append(req.text_content().replace("\xa0", ""))
                data["requirement"] = arr
        time.sleep(1)
    except Exception as e:
        print(e)
    finally:
        print(data)
        return data


try:
    count = 0
    temp_data = []
    for i in range (1, 5):
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
            if any(data.values()):
                temp_data.append(data)
        try:
            with open('careerviet.json', 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                existing_data.extend(temp_data)
            with open('careerviet.json', 'w', encoding='utf-8') as file:
                json.dump(existing_data, file, indent=4, ensure_ascii=False)
                temp_data = []
        except Exception as e:
            print("Error when read/write file:" + str(e))

        
except Exception as e:
    print(e)
finally:
    pass