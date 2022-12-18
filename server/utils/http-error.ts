export default class HttpError extends Error {
  status;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = `HttpError${status}`;
  }
}
