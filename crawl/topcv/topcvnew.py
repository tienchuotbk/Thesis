import requests
from lxml import html
import time
import re
import json

user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
def getSpecificPage(url):
    data = {}
    try:
        response = requests.get(url, headers={'User-agent': user_agent }, timeout= 5)
        if response.status_code == 200:
            data["url"] = url
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
                print('Hehe')
                salary_elements = group_title_element[0].xpath(".//div[@class='job-detail__info--section']//div[contains(text(), 'Mức lương')]/../div[@class='job-detail__info--section-content-value']/text()")
                if len(salary_elements):
                    data["salary"] = salary_elements[0]
                province_element = group_title_element[0].xpath(".//div[@class='job-detail__info--section']//div[contains(text(), 'Địa điểm')]/../div[@class='job-detail__info--section-content-value']/text()")
                if len(province_element):
                    data["province"] = province_element[0]
                exp_elements = group_title_element[0].xpath(".//div[@class='job-detail__info--section']//div[contains(text(), 'Kinh nghiệm')]/../div[@class='job-detail__info--section-content-value']/text()")
                if len(exp_elements):
                    data["experience"] = exp_elements[0]
            
                
                
            expiration_elements = tree.xpath("//div[@class='job-detail__info--deadline']/text()")
            if len(expiration_elements) >= 2:
                data["expiration"] = expiration_elements[1]
            box_right_info = tree.xpath("//div[@class='job-detail__body-right']")
            
        else:
            print(response.status_code)
            print("Not 200")
            time.sleep(5)
        time.sleep(0.5)
    except Exception as e:
        print(e)
    finally:
        print(data)
        return data


try:
    count = 0
    temp_data = []
    for i in range (1, 1000):
        try:
            print("Page "+ str(i))
            url = "https://www.topcv.vn/tim-viec-lam-moi-nhat?sort=new&page="+ str(i)+ "&u_sr_id=XcO0F3dgpKHZlf6aEUZ3As8L4OipQyniCEdr7Iw9_1717989152"

            response = requests.get(url, headers={'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'})

            # Parsing the HTML content
            page_tree = html.fromstring(response.content)

            # Extracting the title element using XPath
            list_a = page_tree.xpath("//div[@class='body-content']//a[not(@class)]")
            for a in list_a:
                job_url = a.get("href")
                
                count += 1
                print(count)
                data = getSpecificPage(job_url)
                if any(data.values()):
                    temp_data.append(data)
            # try:
            #     with open('careerviet.json', 'r', encoding='utf-8') as f:
            #         existing_data = json.load(f)
            #         existing_data.extend(temp_data)
            #     with open('careerviet.json', 'w', encoding='utf-8') as file:
            #         json.dump(existing_data, file, indent=4, ensure_ascii=False)
            #         temp_data = []
            # except Exception as e:
            #     print("Error when read/write file:" + str(e))
        except Exception as e:
                print("Error when read/write file:" + str(e))

        
except Exception as e:
    print(e)
finally:
    pass