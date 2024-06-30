import express, { NextFunction, Request, Response } from "express";

import { InversifyExpressServer } from "inversify-express-utils";

import {
  Application,
  IAbstractApplicationOptions,
  MorganMode,
} from "./lib/abstract-application";
import { Container } from "inversify";

import "./controllers/files.controller";

import { BaseHttpResponse } from "./lib/base-http-response";

import morgan from "morgan";
import { FilesService } from "../logic/services/files.services";
import {
  CouldNotFindFilesException,
  ValidationException,
} from "../logic/exceptions";

export class App extends Application {
  constructor() {
    super({
      containerOpts: { defaultScope: "Singleton" },
      morgan: { mode: MorganMode.DEV },
    });
  }

  configureServices(container: Container): void {
    container.bind(FilesService).toSelf();
  }

  async setup(options: IAbstractApplicationOptions) {
    const server = new InversifyExpressServer(this.container, null, {
      rootPath: "/api",
    });

    server.setErrorConfig((app) => {
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ValidationException) {
          const response = BaseHttpResponse.failed(err.message, 422);
          return res.status(response.statusCode).json(response);
        }

        if (err instanceof CouldNotFindFilesException) {
          const response = BaseHttpResponse.failed(err.message, 404);
          return res.status(response.statusCode).json(response);
        }

        if (err instanceof Error) {
          const response = BaseHttpResponse.failed(err.message, 500);
          return res.status(response.statusCode).json(response);
        }

        next();
      });
    });

    server.setConfig((app) => {
      app.use(express.json());
      app.use(morgan(options.morgan.mode));
    });

    const app = server.build();

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `server is running on http://localhost:${process.env.PORT || 3000}`
      );
    });
  }
}

export default App;
