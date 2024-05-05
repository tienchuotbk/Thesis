import requests
from lxml import html

response = requests.get('https://www.topcv.vn/viec-lam/ke-toan-tong-hop-thu-nhap-hap-dan-theo-nang-luc/1318060.html?ta_source=JobSearchList_LinkDetail&u_sr_id=fb9rSwxMY4xvlIJAB0htZ0v0EqCqVfEJbkxEfloJ_1714750629')
if response.status_code == 200:
    data = {}
    tree = html.fromstring(response.content)
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

    company = tree.xpath('//h2[@class="company-name-label"]/a/text()')
    if(len(company)):
        data['company'] = company[0]
    else:
        data['company'] = None
    if any(data.values()):
        print(data)
else:
    print("Error")

    