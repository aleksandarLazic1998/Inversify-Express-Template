export class HttpException extends Error {
  public constructor(msg: string, public readonly statusCode: number) {
    super(msg)
  }
}
