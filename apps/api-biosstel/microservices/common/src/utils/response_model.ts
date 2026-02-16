class ResponseModel {
  private _success: boolean;
  private _message: string;
  private _data: any;
  private _error: any;
  private _version: string;

  constructor(
    success: boolean,
    message: string,
    data: any,
    error: any,
    version: string
  ) {
    this._success = success;
    this._message = message;
    this._data = data;
    this._error = error ?? "";
    this._version = version;
  }

  public toJson(): any {
    return {
      success: this._success,
      message: this._message,
      data: this._data,
      error: this._error,
      version: this._version,
    };
  }

  public get success(): boolean {
    return this._success;
  }
  public get message(): string {
    return this._message;
  }
  public get data(): any {
    return this._data;
  }
  public get error(): any {
    return this._error;
  }
  public get response(): ResponseModel {
    return this;
  }
}

export default ResponseModel;
