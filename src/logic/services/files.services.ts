import { injectable } from "inversify";
import axios from "axios";
import unorm from "unorm";

const transformData = (listOfUrls: string[]) => {
  const fileStructure: { [key: string]: any } = {};

  const urls: URL[] = listOfUrls.map((url) => new URL(url));

  urls.forEach((url) => {
    const { hostname, pathname } = url;

    const listOfPathsInPathname = pathname
      .split("/")
      .map((item) => decodeURIComponent(item.replace(/\+/g, " ")));

    console.log(listOfPathsInPathname);

    let currentLayer: any = fileStructure[hostname] || [];
    let tempLayer = currentLayer;

    listOfPathsInPathname.forEach((pathInPathname, index) => {
      // console.log(pathInPathname, index);

      if (typeof tempLayer === "object") {
        let found = tempLayer.find(
          (item: any) => typeof item === "object" && item[pathInPathname]
        );

        if (!found) {
          found = { [pathInPathname]: [] };
          tempLayer.push(found);
        }
        tempLayer = found[pathInPathname];
      } else {
        tempLayer.push(pathInPathname);
      }
    });

    fileStructure[hostname] = currentLayer;
  });

  return fileStructure;
};

@injectable()
export class FilesService {
  async getFilesAndTransform() {
    const urls = [
      "http://34.8.32.234:48183/$360Section/",
      "http://34.8.32.234:48183/$360Section/360.7B12DBA104F7493B51086D5C3F01DDDA.q3q",
      "http://34.8.32.234:48183/$RECYCLE.BIN/",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-18/",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-18/desktop.ini",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-21-3419125061-2900363665-2697401647-1008/",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-21-3419125061-2900363665-2697401647-1008/desktop.ini",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-21-3419125061-2900363665-2697401647-1030/",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-21-3419125061-2900363665-2697401647-1030/desktop.ini",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-21-3419125061-2900363665-2697401647-1031/",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-21-3419125061-2900363665-2697401647-1031/desktop.ini",
      "http://34.8.32.234:48183/$RECYCLE.BIN/S-1-5-21-3419125061-2900363665-2697401647-500/",
    ];

    // const response = await axios.get(
    //   "https://rest-test-eight.vercel.app/api/test"
    // );

    // const data = response.data.items.map((item: { fileUrl: string }) => {
    //   return unorm.nfkd(item.fileUrl).replace(/[^\x00-\x7F]/g, "");
    // });

    return transformData(urls);
  }
}
