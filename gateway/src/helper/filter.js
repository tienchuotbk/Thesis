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
export function filterAggregate(filter) {
  let result = [];
  if (filter.type) {
    result.push({
      $match: { type: { $elemMatch: { $eq: parseInt(filter.type) } } },
    });
  }
  if (filter.role) {
    result.push({ $match: { role: parseInt(filter.role) } });
  }
  if (filter.sex) {
    result.push({ $match: { sex: parseInt(filter.sex) } });
  }
  if (filter.salary) {
    let salary = parseInt(filter.salary);
    result.push({
      $match: {
        $or: [
          {
            "salary.type": 1,
            "salary.min": { $lte: salary },
            "salary.max": { $gte: salary },
          },
          { "salary.type": 2, "salary.fixed": salary },
          // Uncomment the following line if you want to include type 3
        //   { "salary.type": 3, "min": { $exists: false }, "max": { $exists: false } },
          { "salary.type": 4, "salary.max": { $gte: salary } },
          { "salary.type": 5, "salary.min": { $lte: salary } },
        ],
      },
    });
  }
  if (filter.age) {
    let age = parseInt(filter.age);
    result.push({
      $match: {
        $or: [
          {
            "age.type": 1,
            "age.min": { $lte: age },
            "age.max": { $gte: age },
          },
          { "age.type": 2, "age.fixed": age },
          { "age.type": 3, "age.max": { $gte: age } },
          { "age.type": 4, "age.min": { $lte: age } }
        ],
      },
    });
  }

  console.log(result);
  return result;
}
