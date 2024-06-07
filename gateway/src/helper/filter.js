// const filters = {
//     type: type,
//     role: role,
//     sex: sex,
//     exp: exp,
//     age: age,
//     salary: salary,
//     level: level,
//     // career: carrer,
//     text: text,
//     province: province
// }
export function filterAggregate(filter){
    let result = []
    if(filter.type){
        result.push({ $match: { "type": { $elemMatch: { $eq: parseInt(filter.type) } } } });
    }
    if(filter.role){
        result.push({ $match: { "role": parseInt(filter.role) } });
    }
    if(filter.sex){
        result.push({ $match: { "sex": parseInt(filter.sex) } });
    }
    
    console.log(result)
    return result
}
