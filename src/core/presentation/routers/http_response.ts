export class HttpResponse {
  status: number;
  data;

  constructor(status: number, data?) {
    this.status = status;
    this.data = data;
  }
}
