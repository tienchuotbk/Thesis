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

export function removeNullishAttributes(obj: any) {
  let newObj = { ...obj }
  for (let key in newObj) {
    if(key){
      console.log(obj[key], obj[key] === "")
      if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
          delete newObj[key];
      }
    }
  }
  return newObj;
}
