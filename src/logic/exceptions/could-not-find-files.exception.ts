export class CouldNotFindFilesException extends Error {
  constructor() {
    super("Missing files")
  }
}
