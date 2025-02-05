import { CorsOptions } from "cors";

const whiteList = ["*"];

const corsOptions: CorsOptions = {
  origin: whiteList,
};
export default corsOptions;
