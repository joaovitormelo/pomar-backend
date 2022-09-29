import { ErrorMessages } from "../../errors/error_messages";
import { HttpRequest } from "./http_request";
import { HttpResponse } from "./http_response";

export class ValidateBody {
  async validate(httpRequest: HttpRequest, properties: Array<string>, body) {
    if (!httpRequest.body) {
      return new HttpResponse(ErrorMessages.infoNoBody.status, {
        code: ErrorMessages.infoNoBody.code,
        msg: ErrorMessages.infoNoBody.msg,
      });
    }
    for (var i in properties) {
      var prop = properties[i];
      if (
        httpRequest.body[prop] == null ||
        httpRequest.body[prop] == undefined
      ) {
        return new HttpResponse(ErrorMessages.infoMissingParameter.status, {
          code: ErrorMessages.infoMissingParameter.code,
          msg: ErrorMessages.infoMissingParameter.msg,
          target: prop,
        });
      }
    }
    return await body();
  }
}
