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
            if len(salary_element):
                data["salary"] = salary_element[0].text_content()
            else:
                print("Cannot get salary")
            title_group_element = tree.xpath("//*[@class='md:flex w-full items-start']")
            if len(title_group_element):
                group_element = title_group_element[0].xpath("//p[@class='']")
                if(len(group_element) == 2):
                    data["expiration"] = group_element[0].text_content()
                    data["location"] = group_element[1].text_content()
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


try:
    count = 0
    temp_data = []
    for i in range (1, 50):
        try:
            # https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?page=2&sort_q=actived_at_by_box%2Cdesc
            url = "https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?page="+ str(i)+ "&sort_q=actived_at_by_box%2Cdesc"

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
            try:
                with open('vieclam24h.json', 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
                    existing_data.extend(temp_data)
                with open('vieclam24h.json', 'w', encoding='utf-8') as file:
                    json.dump(existing_data, file, indent=4, ensure_ascii=False)
                    temp_data = []
            except Exception as e:
                print("Error when read/write file:" + str(e))

        except Exception as e:
            print("Error:" + str(e))
            continue 

        
except Exception as e:
    print(e)
finally:
    pass