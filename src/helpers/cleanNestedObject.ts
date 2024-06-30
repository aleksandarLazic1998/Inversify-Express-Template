import mergeObjectsWithSameKeys from "./mergeObjectsWithSameKeys";

function cleanNestedObject(obj: { [x: string]: any }) {
  const cleanedObj: { [x: string]: any } = {};

  for (const key in obj) {
    const value = obj[key];

    if (Array.isArray(value)) {
      cleanedObj[key] = mergeObjectsWithSameKeys(value);
    } else if (typeof value === "object" && value !== null) {
      cleanedObj[key] = cleanNestedObject(value);
    } else {
      cleanedObj[key] = value;
    }
  }

  return cleanedObj;
}

export default cleanNestedObject;
