function mergeObjectsWithSameKeys(arr: any[]) {
  const mergedObject = {};
  const result = [];

  for (const item of arr) {
    if (typeof item === "string") {
      result.push(item);
    } else if (typeof item === "object" && item !== null) {
      for (const key in item) {
        if (!mergedObject[key]) {
          mergedObject[key] = [];
        }
        mergedObject[key] = mergedObject[key].concat(item[key]);
      }
    }
  }

  for (const key in mergedObject) {
    const mergedArray = mergeObjectsWithSameKeys(mergedObject[key]);

    const filteredArray = mergedArray.filter(
      (element: string | number) =>
        !(typeof element === "string" && mergedObject[element])
    );

    result.push({ [key]: filteredArray });
  }

  return result;
}

export default mergeObjectsWithSameKeys;
