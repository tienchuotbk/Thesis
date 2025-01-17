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
  if (filter.text && filter.text.length) {
    result.push({ $match: { $text: { $search: filter.text } } });
  }
  if (filter.role) {
    result.push({ $match: { role: parseInt(filter.role) } });
  }
  if (filter.sex) {
    result.push({ $match: { sex: parseInt(filter.sex) } });
  }
  if (filter.level) {
    result.push({ $match: { certificate: parseInt(filter.level) } });
  }
  if (filter.type) {
    result.push({
      $match: { type: { $elemMatch: { $eq: parseInt(filter.type) } } },
    });
  }
  if (filter.career) {
    result.push({
      $match: { field: { $elemMatch: { $eq: filter.career } } },
    });
  }
  if (filter.province) {
    result.push({
      $match: { location: { $elemMatch: { province: filter.province } } },
    });
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
          { "age.type": 4, "age.min": { $lte: age } },
        ],
      },
    });
  }

  if (filter.exp !== null && filter.exp !== undefined && filter.exp.length) {
    let experience = parseInt(filter.exp);
    if (experience === 0) {
      result.push({
        $match: {
          "experience.type": 0,
        },
      });
    } else if (experience === 5) {
      result.push({
        $match: {
          $or: [
            {
              "experience.type": 1,
              "experience.min": { $gt: 5 },
            },
            { "experience.type": 2, "experience.fixed": { $gt: 5 } },
            { "experience.type": 4, "experience.min": { $gt: 5 } },
          ],
        },
      });
    } else {
      result.push({
        $match: {
          $or: [
            {
              "experience.type": 1,
              "experience.min": { $lt: experience },
              "experience.max": { $gte: experience },
            },
            { "experience.type": 2, "experience.fixed": experience },
            { "experience.type": 3, "experience.max": { $gt: experience } },
            { "experience.type": 4, "experience.min": { $lt: experience } },
          ],
        },
      });
    }
  }

  return result;
}

export function getMapWhereClause(filter) {
  let result = [];
  if (filter.certificate !== null) {
    result.push(`certificate = ${filter.certificate}`);
  }
  if (filter.field && filter.field.length) {
    result.push(`arrayExists(x -> x = '${filter.field}', field)`);
  }
  if (filter.experiece) {
    result.push(`(
    (experience.type = 1 AND experience.min < ${filter.experiece} AND experience.max >= ${filter.experiece}) OR
    (experience.type = 2 AND experience.fixed = ${filter.experiece}) OR
    (experience.type = 3 AND experience.max > ${filter.experiece}) OR
    (experience.type = 4 AND experience.min < ${filter.experiece})
    )`);
  }
  return result.length
    ? " WHERE loc.province != '' AND " + result.join(" AND ")
    : " WHERE loc.province != ''";
}
export function getPieWhereClause(filter) {
  let result = [];
  if (filter.certificate !== null) {
    result.push(`certificate = ${filter.certificate}`);
  }
  if (filter.field && filter.field.length) {
    result.push(`arrayExists(x -> x = '${filter.field}', field)`);
  }
  if (filter.experiece) {
    result.push(`(
    (experience.type = 1 AND experience.min < ${filter.experiece} AND experience.max >= ${filter.experiece}) OR
    (experience.type = 2 AND experience.fixed = ${filter.experiece}) OR
    (experience.type = 3 AND experience.max > ${filter.experiece}) OR
    (experience.type = 4 AND experience.min < ${filter.experiece})
    )`);
  }
  return result.length ? " WHERE " + result.join(" AND ") : "";
}

export function getTableExpWhereClause(filter) {
  let result = [];
  if (filter.certificate !== null) {
    result.push(`certificate = ${filter.certificate}`);
  }
  if (filter.field && filter.field.length) {
    result.push(`arrayExists(x -> x = '${filter.field}', field)`);
  }
  return result.length ? " WHERE " + result.join(" AND ") : "";
}

export function getTableWhereClause(filter) {
  let result = [];
  if (filter.certificate !== null) {
    result.push(`certificate = ${filter.certificate}`);
  }
  if (filter.experiece) {
    result.push(`(
    (experience.type = 1 AND experience.min < ${filter.experiece} AND experience.max >= ${filter.experiece}) OR
    (experience.type = 2 AND experience.fixed = ${filter.experiece}) OR
    (experience.type = 3 AND experience.max > ${filter.experiece}) OR
    (experience.type = 4 AND experience.min < ${filter.experiece})
    )`);
  }

  return result.length ? " WHERE " + result.join(" AND ") : "";
}
