import { ErrorMessages } from "../../errors/error_messages";
import { HttpRequest } from "./http_request";
import { HttpResponse } from "./http_response";

export class ValidateBody {
  static async validate(
    httpRequest: HttpRequest,
    properties: Array<string>,
    body
  ) {
    if (!httpRequest.body) {
      console.log("Missing body");
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
        console.log(`Missing ${prop}`);
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
