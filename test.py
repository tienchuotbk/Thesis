import requests
from lxml import html

response = requests.get('https://www.topcv.vn/viec-lam/ke-toan-tong-hop-thu-nhap-hap-dan-theo-nang-luc/1318060.html?ta_source=JobSearchList_LinkDetail&u_sr_id=fb9rSwxMY4xvlIJAB0htZ0v0EqCqVfEJbkxEfloJ_1714750629')
if response.status_code == 200:
    tree = html.fromstring(response.content)
    salary_elemet = tree.xpath('//*[@id="header-job-info"]/div[@class="job-detail__info--sections"]/div[1]/div[@class="job-detail__info--section-content"]/div[@class="job-detail__info--section-content-value"]')[0].text_content()
    print(salary_elemet)
    #header-job-info > div.job-detail__info--sections > div:nth-child(1) > div.job-detail__info--section-content > div.job-detail__info--section-content-value
else:
    print("Error")

    