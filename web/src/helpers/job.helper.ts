import defaultComponentSrc from "../assets/images/default_company.jpg";

export const getLogoSrc = (href: string) => {
  if(!href){
    return defaultComponentSrc
  }
  if (href.includes("https://")) {
    return href;
  } else {
    return defaultComponentSrc;
  }
};
export const getSalaryText = (salary: any) => {
  let text: any;
  switch (salary.type) {
    case 0:
      text = `Không có dữ liệu`;
      break;
    case 1:
      text = `${salary.min} Triệu -${salary.max} Triệu`
      break;
    case 2:
      text = `${salary.fixed} Triệu`
      break;
    case 3:
      text = `Thảo thuận`
      break;
    case 4:
      text = `Lên đến ${salary.max} Triệu`
      break;
    case 5:
      text = `Trên ${salary.min} Triệu`
      break;
    default:
      text = `Không có dữ liệu`;
  }
  return text;
}
export const getExpString = (expObj: any) => {
  if(!expObj || !Object.keys(expObj).length) return 'Không yêu cầu';
  if(expObj.type === 1){
    return `${expObj.min} đến ${expObj.max} năm`
  } else if(expObj.type === 2){
    return `${expObj.fixed} năm`
  } else if(expObj.type === 3){
    return `Đến ${expObj.max} năm`
  } else if(expObj.type === 4){
    return `Từ ${expObj.min} năm`
  } else if(expObj.type === 0){
    return `Không yêu cầu`
  }
}

export const getAgeString = (ageObj: any) => {
  if(!ageObj || !Object.keys(ageObj).length) return 'Không yêu cầu';
  if(ageObj.type === 1){
    return `${ageObj.min} - ${ageObj.max}`
  } else if(ageObj.type === 2){
    return `${ageObj.fixed}`
  } else if(ageObj.type === 3){
    return `Dưới ${ageObj.max}`
  } else if(ageObj.type === 4){
    return `Trên ${ageObj.min}`
  } else if(ageObj.type === 0){
    return `Không yêu cầu`
  }
}

export function getSex(sex: string){
  if(!sex){
    return "Không yêu cầu"
  };
  let sexInt = parseInt(sex);
  if(sexInt === 0){
    return "Không yêu cầu"
  } else if(sexInt === 1){
    return "Nam"
  } else {
    return "Nữ"
  }
}

export function removeNullishAttributes(obj: any) {
  let newObj = { ...obj }
  for (let key in newObj) {
    console.log(obj[key]);
    console.log(key)
    if(key){
      if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
          delete newObj[key];
      }
    }
  }
  return newObj;
}
