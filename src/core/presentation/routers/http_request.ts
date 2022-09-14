export class HttpRequest {
  body: any;
  headers: object;

  constructor(body: any, headers: object) {
    this.body = body;
    this.headers = headers;
  }
}
