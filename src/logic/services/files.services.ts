import { injectable } from "inversify";
import axios from "axios";
import unorm from "unorm";
import cleanNestedObject from "../../helpers/cleanNestedObject";

function isEmpty(obj: { [key: string]: any }) {
  return Object.keys(obj).length === 0;
}
const transformData = (listOfUrls: string[]) => {
  const fileStructure: { [key: string]: any } = {};

  const urls: URL[] = listOfUrls.map((url) => new URL(url));

  urls.forEach((url) => {
    const { hostname, pathname } = url;

    const listOfPathsInPathname = pathname
      .split("/")
      .filter((item) => item !== "")
      .map((item) => decodeURIComponent(item.replace(/\+/g, " ")));

    if (!fileStructure[hostname]) fileStructure[hostname] = [];

    let currentDir: any = fileStructure[hostname];
    let temporaryMemory: { [key: string]: any } = {};

    for (let index = 0; index < listOfPathsInPathname.length; index++) {
      const element = listOfPathsInPathname[index];
      if (index !== listOfPathsInPathname.length - 1) {
        let found = currentDir.find(
          (item: any) => typeof item === "object" && currentDir[element]
        );
        if (!found) {
          found = { [element]: [] };
          currentDir.push(found);
        }
        currentDir = found[element];
        temporaryMemory = found;
      } else {
        if (isEmpty(temporaryMemory)) return;

        currentDir.push(element);
      }
    }
  });

  return cleanNestedObject(fileStructure);
};

@injectable()
export class FilesService {
  async getFilesAndTransform() {
    try {
      const response = await axios.get(
        "https://rest-test-eight.vercel.app/api/test"
      );

      const data = response.data.items.map((item: { fileUrl: string }) => {
        return unorm.nfkd(item.fileUrl).replace(/[^\x00-\x7F]/g, "");
      });

      return transformData(data);
    } catch (error) {
      return error;
    }
  }
}
