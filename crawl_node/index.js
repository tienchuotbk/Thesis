const fs = require("fs");
const axios = require("axios");
const { parse } = require("node-html-parser")
let config = (page) => ({
  method: "post",
  maxBodyLength: Infinity,
  url: "https://www.topcv.vn/tim-viec-lam-moi-nhat?page=" + page,
  headers: {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,vi;q=0.8",
    "content-length": "0",
    cookie:
      '_fbp=fb.1.1703385911556.340848695; dtdz=678f6f0f-b86c-4fa1-a8c8-16ddf228504c; __RC=4; __R=1; __tb=0; g_state={"i_l":0}; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IkJEeFo5MzczbkdXVmZHZEVuSDVQT3c9PSIsInZhbHVlIjoiTWFXeEpwbWVtSXBneEdGaGZtN0xmcHUvVUpITmlMRW01bEY1dGJUMFdNR1VPVEN0dG5aMVZ5Q2F3V3R5dlY3Q1RvVnJGdVZqNUxzeEVwR2t6M3g2UjBxQW5PZ1dKTVMrOTF4RS9ka212VW16cVVuN2N2dElTYnFyckZBZ0d3cCtwaXBCRzN6bGJxSldINjZtWWo2aU1ZTmNMNlFPb0p5S3p5dzVxQ1RnNndQSU9sMFZQUnJMMjlzT3NicHNTL2dkbzlMclFKNldOdjc2SUR0aysvMVNROW9zaXh5Nkdoa2RYcGo1Wlp2TXFsMD0iLCJtYWMiOiIyZGVhMTNiZmNjNGQ4Nzc0YmE1MjVmN2U3ZDAzZDE2ZmRkNjFmODBmMjFmNjRhYmI5YTJlOTkwNDNmNDBhZjk5IiwidGFnIjoiIn0%3D; __IP=1984233995; _clck=1vlc37c%7C2%7Cfkx%7C0%7C1453; popup-ebook-cv=1; cf_clearance=1EDmA.roiuLO9zlLpLnfoYUMkw3nwAN7k5CHQ9nigJk-1715005213-1.0.1.1-jMs3y6B68F2CuYbFEK8FHvWtdiX59WNFWmSuMGjGwFF7s.LvQbf9Xr9AtPa2N6TXUqGsABLxR85fM6iSCoaHug; _taid=smq6zN4O4Z.1715005214482; _tafp=fc6fa3e2636f85fc8cd1052525166837; appier=%7B%22event%22%3A%22job_searched%22%2C%22payload%22%3A%7B%22searched_keyword%22%3A%22%22%2C%22job_category%22%3A%22%22%2C%22company_category%22%3A%22%22%2C%22work_location%22%3A%22%22%7D%7D; popup-anti-scam=false; XSRF-TOKEN=eyJpdiI6InFiMmpEWFlZVzZjVEx2WDhGSkl2U2c9PSIsInZhbHVlIjoiaHVYQU5LMHlJYVR1dkVrN0M1RWNCNGY5L0NWZGMvR1M3R2RnVXhJRlFKYnVNTUp2K3VnOHcwRW9zeDNGeUlESWpwRXd4Q0Fhak83SktscUFQQXNGOXptZGNiekJ5VlRuU0NSTTA0TktGd0dMOEhoYVZQd25qUWovNFBmZnFRN2oiLCJtYWMiOiJmNmZmYzc0MmNlMmZhZWExMmFiYjExYWZkNzFjMjk0NTM4NGVhYjE0YWFiMDI4ZTg3YjBiYWNhNjJhMjY4YTYyIiwidGFnIjoiIn0%3D; topcv_session=eyJpdiI6IjNYL0ZFL0RIMm1FbVorZGpnR0hHc2c9PSIsInZhbHVlIjoiNmhxRHZ0SU9hK3RlMGl5NSttM0VNUEJFa0ttWmxvcVBFNm5va1Z2RGpqcnVoWDJFVThOeFVPdVZWV0dteDlXZDhsYlVQZDFSSXhpNUdMQXBHVFJmc0tyVjNqcEZGOHRGSElmNEM1VlhzaUxrayt6WWJ3Z3hIQkZ3Nk1tbWNUVW4iLCJtYWMiOiJhZmFjOWQ1OGY4NWY1YjY1NmQ1NzUzMjA2ZDUyNzcyODYzMjI5MWY4YjNmMGIxM2VmMjlmNmExNGZmYzUwYmM4IiwidGFnIjoiIn0%3D; XSRF-TOKEN=eyJpdiI6IjdwdkhaZlI0cVlGMXJKY0xva3lWSlE9PSIsInZhbHVlIjoiK01BTzRMQTJ6SzNGbXNGTmVSZFdCd1QyWlo4YzdodFE2TllZMkdWQmowS3dMak5tNVFSOHZQKzhwOHpaZUZqVWlkSmZvNWI5b1lrT0J1ODVTaERSNWpGbTczKzVFU0RMUWlhNGh4RTNNUGxxSTc1N3RyUjlTUFVGWmhRV1VkdWoiLCJtYWMiOiI1YmYxYWU0N2YwNDIzYzgzMTYxZjM1Nzg3ZjJjZWIzZmE5ZTEzYTU2NjA5YzdlMDgyMzQ4NzA0ZjJlZjJlZjE0IiwidGFnIjoiIn0%3D; topcv_session=eyJpdiI6ImZEWm4zb3BkN3k2Qk15S1NjVk1ydGc9PSIsInZhbHVlIjoib1Vod0xOb1lITm1PU2VxTkJqdmgwVHI0Qld0WXVxSnpYQ01GMXEvaXFwQVVNSUJreW9UTVRGb2Q2Zk9DT3RTRVlrRnFLYmI2Tzh4MTAyQ2NMbjJIeGxzTi92VDVlT3oxakt5N2ZBc2U4blRvTHg4RlI2V0xHTUlONDJZM0M3SkgiLCJtYWMiOiJhNGRiNDM5MTg4Nzg4MzZhYWRlMTRiZjNhYWIxZjM3N2M4N2Q2MTQ5MWE5YTQzMjgzMjMxODJlNGM0YWM3NGU0IiwidGFnIjoiIn0%3D',
    origin: "https://www.topcv.vn",
    priority: "u=1, i",
    referer: "https://www.topcv.vn/tim-viec-lam-moi-nhat",
    "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "x-csrf-token": "Ql3phXlNGfR8HElqDRX7wHOay53jlwv2HX30cWIi",
    "x-requested-with": "XMLHttpRequest",
  },
});

const main = async () => {
  var stream = fs.createWriteStream(`${process.cwd()}/result.json`, { flags: "a" });
  const result = [];
  for (let i = 10; i <= 20; i++) {
    console.log({ i });
    await new Promise(res => setTimeout(res, 500))
    await axios
      .request(config(i))
      .then((response) => {
        const htmlString = response.data.data.html_job
        const root = parse(htmlString)
        const bodyContents = root.querySelectorAll(".body-content")
        if (bodyContents) {
          bodyContents.forEach(bodyContent => {
            const title = bodyContent.querySelector(".company")
            if (title) {
              const item_result = {
                title: title.textContent
              }
              result.push(item_result)

            }
          })

        }
      })
      .catch((error) => {
        console.log("error", error.message);
      });
  }
  stream.write(JSON.stringify(result));
  stream.close()
}

main()