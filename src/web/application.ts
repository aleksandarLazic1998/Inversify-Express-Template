import express, { NextFunction, Request, Response } from "express";

import { InversifyExpressServer } from "inversify-express-utils";

import {
  Application,
  IAbstractApplicationOptions,
} from "./lib/abstract-application";
import { Container } from "inversify";

import "./controllers/some.controller";

import { BaseHttpResponse } from "./lib/base-http-response";

import morgan from "morgan";
import {
  CouldNotFindFilesException,
  ValidationException,
} from "../logic/exceptions";
import { MorganMode } from "../typescript/enums/morgan-mode";
import { SomeService } from "../logic/services/some.services";
import { AuthService } from "../logic/services/auth.service";
import { AuthController } from "./controllers/auth.controller";

export class App extends Application {
  constructor() {
    super({
      containerOpts: { defaultScope: "Singleton" },
      morgan: { mode: MorganMode.DEV },
    });
  }

  configureControllers(container: Container): void {
    container.bind(AuthController).toSelf();
  }

  configureServices(container: Container): void {
    container.bind(SomeService).toSelf();
    container.bind(AuthService).toSelf();
  }

  async setup(options: IAbstractApplicationOptions) {
    const server = new InversifyExpressServer(this.container, null, {
      rootPath: "/api/v1",
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
