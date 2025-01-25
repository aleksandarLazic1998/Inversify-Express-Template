import { injectable } from "inversify";

@injectable()
export class SomeService {
  async someServiceMethod(): Promise<void> {
    // service logic
  }
}
