function mergeObjectsWithSameKeys(
  arr: (string | Record<string, any>)[]
): any[] {
  const mergedObject: Record<string, any> = {};
  const result: any[] = [];

  for (const item of arr) {
    if (typeof item === "string") {
      result.push(item);
    } else if (typeof item === "object" && item !== null) {
      for (const key in item) {
        if (!mergedObject[key]) {
          mergedObject[key] = [];
        }
        if (Array.isArray(item[key])) {
          mergedObject[key] = mergedObject[key].concat(item[key]);
        } else {
          mergedObject[key].push(item[key]);
        }
      }
    }
  }

  for (const key in mergedObject) {
    const mergedArray = mergeObjectsWithSameKeys(mergedObject[key]);

    const filteredArray = mergedArray.filter(
      (element: string | number) =>
        !(
          typeof element === "string" &&
          Object.keys(mergedObject).includes(element as string)
        )
    );

    result.push({ [key]: filteredArray });
  }

  return result;
}

export default mergeObjectsWithSameKeys;
