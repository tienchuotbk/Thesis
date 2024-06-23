export function removeNullAndEmpty(obj) {
    let newObj = { ...obj}
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete newObj[key];
        } else  if(key !== 'career' && key !== 'province'  && !Number.isNaN(obj[key])){
            newObj[key] = parseInt(obj[key])
        }
    }
    return newObj;
}