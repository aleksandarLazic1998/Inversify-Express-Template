import { CorsOptions } from "cors";
import { Container, interfaces } from "inversify";
import { MorganMode } from "src/typescript/enums/morgan-mode";

export interface IAbstractApplicationOptions {
  corsOptions: CorsOptions;
  containerOpts: interfaces.ContainerOptions;
  morgan: { mode: MorganMode };
}

export abstract class Application {
  protected readonly container: Container;

  constructor(options: IAbstractApplicationOptions) {
    this.container = new Container(options.containerOpts);

    this.configureServices(this.container);
    this.configureControllers(this.container);
    this.setup(options);
  }

  abstract configureServices(container: Container): void;
  abstract configureControllers(container: Container): void;
  abstract setup(options: IAbstractApplicationOptions): Promise<void> | void;
}
