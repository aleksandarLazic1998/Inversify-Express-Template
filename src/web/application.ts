import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

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
import helmet from "helmet";
import corsOptions from "../constants/cors.constants";
import PassportAzureActiveDirectoryStrategy from "../config/passport.config";

export class App extends Application {
  constructor() {
    super({
      corsOptions: corsOptions,
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
      // Library specific
      app.use(express.json());
      app.use(morgan(options.morgan.mode));
      app.use(helmet());
      app.use(cors(options.corsOptions));
      app.use(cookieParser());

      app.use(express.static("public"));

      app.use(passport.initialize());
      passport.use(PassportAzureActiveDirectoryStrategy);

      // Global custom made
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
