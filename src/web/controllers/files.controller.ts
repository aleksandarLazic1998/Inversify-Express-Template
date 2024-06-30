import { Request, Response } from "express"
import { controller, httpGet } from "inversify-express-utils"
import { FilesService } from "../../logic/services/files.services"
import { BaseHttpResponse } from "../lib/base-http-response"

@controller("/files")
export class FilesController {
  constructor(private readonly _service: FilesService) {}

  @httpGet("/")
  async index(req: Request, res: Response) {
    const files = await this._service.getFilesAndTransform()

    const response = BaseHttpResponse.success(files)
    return res.json(response)
  }
}
