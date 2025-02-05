import { controller, httpGet } from "inversify-express-utils";
import { AuthService } from "../../logic/services/auth.service";

@controller("/auth")
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @httpGet("/")
  async index(req: Request, res: Response) {
    return "True";
  }
}
