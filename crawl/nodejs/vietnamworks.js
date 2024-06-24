const fs = require("fs")
const axios = require('axios');

async function fetch(i) {
    let data = {
        "query": "",
        "order": [
            {
                "field": "lastPostJobOn",
                "value": "desc"
            }
        ],
        "hitsPerPage": 9,
        "filter": [
            {
                "field": "profilePublishedSiteMask",
                "value": "1,3"
            }
        ],
        "page": i,
        "ranges": [
            {
                "field": "companyId",
                "operator": ">",
                "value": "0"
            }
        ],
        "regexp": [
            {
                "field": "companySlug",
                "value": ".+"
            }
        ],
        "isJobs": true
    }
    data = JSON.stringify(data)

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ms.vietnamworks.com/company-profile/v1.0/company/search',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'vi',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://www.vietnamworks.com',
            'Referer': 'https://www.vietnamworks.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Cookie': 'cookiesession1=678A3E0D9521B522C3586563098BAD08'
        },
        data: data
    };

    let companies = []
    await axios.request(config)
        .then((response) => {
            const responseData = response.data
            if (responseData.meta.code === 200 && responseData.data.length) {
                companies = responseData.data;
            }
        })
        .catch((error) => {
            console.log(error);
        });

    if (companies.length) {
        return companies
    } else {
        return []
    }

}
async function main() {
    const companies = []
    for (let i = 1; i <= 44; i++) {
        console.log({ i })
        const listCompany = await fetch(i)
        companies.push(...listCompany)
        await new Promise(res => setTimeout(res, 2000))
    }

    const filePath = `${process.cwd()}/data/vietnamworks_company.json`
    const contentFile = { companies: companies }
    fs.writeFileSync(filePath, JSON.stringify(contentFile))
}
main()