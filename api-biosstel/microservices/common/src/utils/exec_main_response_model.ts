import ResponseModel from "./response_model";

class ExecMainResponseModel {
  private _statusCode: number;
  private _response: ResponseModel;

  constructor(statusCode: number, response: ResponseModel) {
    this._statusCode = statusCode;
    this._response = response;
  }

  public get statusCode(): number {
    return this._statusCode;
  }
  public get response(): ResponseModel {
    return this._response;
  }
}

export default ExecMainResponseModel;
