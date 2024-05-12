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
            title_element = tree.xpath("//h1[contains(@class, 'leading-snug')]")
            if len(title_element):
                data["title"] = title_element[0].text_content()
            else:
                print("Cannot get title")
            company_element = tree.xpath("//*[@class='md:ml-7 w-full']/a")
            if len(company_element):
                data["company"] = company_element[0].text_content()
            else:
                print("Cannot get company")
            salary_element = tree.xpath("//*[@class='font-semibold text-14 text-[#8B5CF6]']")
            # print(salary_element)
            if len(salary_element):
                data["salary"] = salary_element[0].text_content()
            else:
                print("Cannot get salary")
            # ml-3 text-14 md:flex pt-0 md:pt-[5px] my-0
            title_group_element = tree.xpath("//*[@id='__next']/div/main/div/div[2]/div[1]/div/div[1]/div[2]/h2")
            # print(title_group_element)
            if len(title_group_element):
                group_element = title_group_element[0].xpath("//p[@class='']")
                if(len(group_element) == 2):
                    data["expriration"] = group_element[0].text_content()
                    data["location"] = group_element[1].text_content()
            else:
                print("Cannot get expriration and location")
            group_element = tree.xpath("//*[@class='w-full lg:w-3/4 pb-4']/div[contains(@class, 'jsx-d84db6a84feb175e md:flex')]")
            if len(group_element) == 4:
                pass
            print(group_element)
                        
        time.sleep(1)
    except Exception as e:
        print(e)
    finally:
        print(data)
        return data


try:
    count = 0
    temp_data = []
    for i in range (1, 2):
        url = "https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?page="+ str(i)

        response = requests.get(url, headers={'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'})

        # Parsing the HTML content
        tree = html.fromstring(response.content)
        
        # Extracting the title element using XPath
        list_a = tree.xpath('//div[@class="relative m-auto w-full"]/div/div/div/a')
        for a in list_a:
            job_url = a.get("href")
            count += 1
            print(count)
            job_full_url = "https://vieclam24h.vn"+ job_url
            data = getSpecificPage(job_full_url)
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
    print(e)
finally:
    pass