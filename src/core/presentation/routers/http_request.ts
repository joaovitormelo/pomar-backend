export class HttpRequest {
  body: any;
  headers: any;
  params: any;

  constructor(body: any, headers: any, params: any) {
    this.body = body;
    this.headers = headers;
    this.params = params;
  }
}
