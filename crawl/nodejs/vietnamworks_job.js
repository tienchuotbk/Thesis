const fs = require("fs")
const axios = require('axios');

async function fetch(i) {
    let data = JSON.stringify({
        "userId": i,
        "query": "",
        "filter": [],
        "ranges": [],
        "order": [],
        "hitsPerPage": 50,
        "page": 170,
        "retrieveFields": []
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ms.vietnamworks.com/job-search/v1.0/search',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'https://www.vietnamworks.com',
            'Referer': 'https://www.vietnamworks.com/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'X-Source': 'Page-Container',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Cookie': 'cookiesession1=678A3E0D9521B522C3586563098BAD08'
        },
        data: data
    };


    let jobs = []
    await axios.request(config)
        .then((response) => {
            const responseData = response.data
            if (responseData.meta.code === 200 && responseData.data.length) {
                jobs = responseData.data;
            }
        })
        .catch((error) => {
            console.log(error);
        });

    if (jobs.length) {
        return jobs
    } else {
        return []
    }

}
async function main() {
    const jobs = []
    for (let i = 1; i <= 170; i++) {
        console.log({ i })
        const listJob = await fetch(i)
        jobs.push(...listJob)
        await new Promise(res => setTimeout(res, 2000))
    }

    const filePath = `${process.cwd()}/data/vietnamworks_job.json`
    const contentFile = { jobs: jobs }
    fs.writeFileSync(filePath, JSON.stringify(contentFile))
}
main()