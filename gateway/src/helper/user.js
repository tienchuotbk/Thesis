export function removeNullAndEmpty(obj) {
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete obj[key];
        } else  if(key !== 'career' && !Number.isNaN(obj[key])){
            console.log(obj[key] + ' la so ne')
            obj[key] = parseInt(obj[key])
        }
    }
    return obj;
}