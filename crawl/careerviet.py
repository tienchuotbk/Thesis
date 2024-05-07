import requests
from lxml import html

def getSpecificPage(url):
    response = requests.get(url, headers={'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'})
    pass

try:
    count = 0
    temp_data = []
    for i in range (1, 3):
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
    passresponse = requests.get(url, headers={'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'})