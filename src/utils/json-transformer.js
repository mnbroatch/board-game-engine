// recurse and replace. circular references not allowed
export default function transformJSON(data, rules) {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    let result = value;
    for (const rule of rules) {
      if (rule.test(result)) {
        result = rule.replace(result);
      }
    }
    return result;
  });
}
