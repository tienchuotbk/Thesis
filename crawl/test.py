import requests
from lxml import html
import json
from bs4 import BeautifulSoup

body = {
    "userId": 0,
    "query": "",
    "filter": [],
    "ranges": [],
    "order": [],
    "hitsPerPage": 50,
    "page": 0,
    "retrieveFields": [
        "address",
        "benefits",
        "jobTitle",
        "salaryMax",
        "isSalaryVisible",
        "jobLevelVI",
        "isShowLogo",
        "salaryMin",
        "companyLogo",
        "userId",
        "jobLevel",
        "jobLevelId",
        "jobId",
        "jobUrl",
        "companyId",
        "approvedOn",
        "isAnonymous",
        "alias",
        "expiredOn",
        "industries",
        "workingLocations",
        "services",
        "companyName",
        "salary",
        "onlineOn",
        "simpleServices",
        "visibilityDisplay",
        "isShowLogoInSearch",
        "priorityOrder",
        "skills",
        "profilePublishedSiteMask",
        "jobDescription",
        "jobRequirement",
        "prettySalary",
        "requiredCoverLetter",
        "languageSelectedVI",
        "languageSelected",
        "languageSelectedId"
    ]
}
final_data = []
def getRequiremnet(string):
    paragraphs = []
    soup = BeautifulSoup(string, 'lxml')

    # Iterate over the <p> tags
    for p in soup.find_all('p'):
        strong_tag = p.find('strong')
        if not strong_tag:
            # Only add content that does not contain a <strong> tag
            content = p.get_text(strip=True)
            if content:  # Only add non-empty content
                paragraphs.append(content)
    return paragraphs
existing_data = []
for i in range(0, 5):
    body["page"] = i
    response = requests.post('https://ms.vietnamworks.com/job-search/v1.0/search', json=body)

    if response.status_code == 200:
        list_data = response.json()["data"]
        # with open('vietnamwork.json', 'w', encoding='utf-8') as file:
        #     json.dump(list_data, file, indent=4, ensure_ascii=False)
        final_data = []
        for data in list_data:
            temp_data = {}
            raw_requirement = data["jobRequirement"]
            temp_data["title"] = data["jobTitle"]
            temp_data["job_id"] = data["jobId"]
            temp_data["exprition"] = data["expiredOn"]
            temp_data["comapany"] = data["companyName"]
            temp_data["requirement"] = getRequiremnet(raw_requirement)
            temp_data["skills"] = [skill['skillName'] for skill in data["skills"]]
            temp_data["benefits"] = [val['benefitValue'] for val in data["benefits"]]
            temp_data["location"] = [val['address'] for val in data["workingLocations"]]
            temp_data["salary"] = data["prettySalary"]
            temp_data["salary_min"] = data["salaryMin"]
            temp_data["salary_max"] = data["salaryMax"]
            temp_data["age"] = data["rangeAge"]
            temp_data["role"] = data["jobLevel"]
            final_data.append(temp_data)
    else:
        print("Error")
    try:
        with open('vieclam24h.json', 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
            existing_data.extend(final_data)
        with open('vietnamwork.json', 'w', encoding='utf-8') as file:
            json.dump(existing_data, file, indent=4, ensure_ascii=False)
            existing_data = []
    except Exception as e:
        print(e)


    