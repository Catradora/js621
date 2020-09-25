import axios, { AxiosRequestConfig } from "axios";
import { StateInfo, Method } from "./interfaces";

export class Model {
  public stateInfo: StateInfo;
  //private throttledResponse: any;

  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
    // this.throttledResponse = this.stateInfo.rateLimiter.wrap(
    //   this.submit_request
    // );
  }

  // private updateStateInfo = (stateInfo: StateInfo) => {
  //   // Keep stateInfo up-to-date after login, etc.
  //   this.stateInfo = stateInfo;
  // };

  //Updated to funcName = () => {} syntax to bind "this" to this class context.
  private submit_request = (query_url: string, method: Method) => {
    if (this.stateInfo.username && this.stateInfo.api_key) {
      const axiosConfig: AxiosRequestConfig = {
        method: method,
        url: query_url,
        headers: { "User-Agent": this.stateInfo.userAgent },
        auth: {
          username: this.stateInfo.username,
          password: this.stateInfo.api_key,
        },
      };
      return axios(axiosConfig);
    } else {
      const axiosConfig: AxiosRequestConfig = {
        method: "get",
        url: query_url,
        headers: { "User-Agent": this.stateInfo.userAgent },
      };

      return axios(axiosConfig);
    }
  };

  public submit_throttled_request = (url: string, method: Method) => {
    return this.stateInfo.rateLimiter.schedule(
      this.submit_request,
      url,
      method
    );
  };
}
