import {
  HttpRequest,
  HttpResponse,
} from "../../features/login/presentation/routers/login_router";

export class ExpressAdapter {
  loginRouterFunc: (httpRequest: HttpRequest) => Promise<HttpResponse>;

  constructor(
    loginRouterFunc: (httpRequest: HttpRequest) => Promise<HttpResponse>
  ) {
    this.loginRouterFunc = loginRouterFunc;
  }

  adapt = async (req, res) => {
    const response: HttpResponse = await this.loginRouterFunc(
      new HttpRequest(req.body, req.headers)
    );
    if (response.status != 200) {
      res.status(response.status).json(response.data);
    } else {
      res.json(response.data);
    }
  };
}
