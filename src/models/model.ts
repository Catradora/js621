import axios, { AxiosRequestConfig } from "axios";
import { StateInfo } from "./stateinfo";

export class Model {
  public stateInfo: StateInfo;

  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
  }

  updateStateInfo(stateInfo: StateInfo) {
    // Keep stateInfo up-to-date after login, etc.
    this.stateInfo = stateInfo;
  }

  private async submit_request(
    query_url: string,
    method:
      | "get"
      | "GET"
      | "delete"
      | "DELETE"
      | "post"
      | "POST"
      | "put"
      | "PUT"
      | "patch"
      | "PATCH"
  ) {
    if (this.stateInfo.username && this.stateInfo.api_key) {
      const axiosConfig: AxiosRequestConfig = {
        method: method,
        url: query_url,
        headers: this.stateInfo.userAgent,
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
  }

  public async submit_throttled_request(
    url: string,
    method:
      | "get"
      | "GET"
      | "delete"
      | "DELETE"
      | "post"
      | "POST"
      | "put"
      | "PUT"
      | "patch"
      | "PATCH"
  ) {
    const throttledresponse = this.stateInfo.rateLimiter.wrap(
      this.submit_request
    );

    return throttledresponse(url, method);
  }
}
