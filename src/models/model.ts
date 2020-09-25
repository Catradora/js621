import axios, { AxiosRequestConfig } from "axios";
import { StateInfo, Method } from "./interfaces";

export class Model {
  public stateInfo: StateInfo;

  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
  }

  // private updateStateInfo = (stateInfo: StateInfo) => {
  //   // Keep stateInfo up-to-date after login, etc.
  //   this.stateInfo = stateInfo;
  // };

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
        headers: this.stateInfo.userAgent,
      };

      return axios(axiosConfig);
    }
  };

  public submit_throttled_request = (url: string, method: Method) => {
    const throttledresponse = this.stateInfo.rateLimiter.wrap(
      this.submit_request
    );

    return throttledresponse(url, method);
  };
}
