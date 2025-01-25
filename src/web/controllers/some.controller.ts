import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { BaseHttpResponse } from "../lib/base-http-response";
import { SomeService } from "../../logic/services/some.services";

@controller("/some")
export class SomeController {
  constructor(private readonly _service: SomeService) {}

  @httpGet("/")
  async index(req: Request, res: Response) {
    const serviceRes = await this._service.someServiceMethod();

    const response = BaseHttpResponse.success(serviceRes);
    return res.json(response);
  }
}
