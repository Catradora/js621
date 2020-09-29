import axios, { AxiosRequestConfig } from "axios";
import { StateInfo } from "./interfaces";
import { ModelRequestArgs as RequestArgs } from "./argumentTypes";

export class Model {
  public stateInfo: StateInfo;

  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
  }

  //Updated to funcName = () => {} syntax to bind "this" to this class context.
  public submit_request = async ({
    query_url,
    method,
    multipart,
  }: RequestArgs) => {
    if (
      this.stateInfo.username !== undefined &&
      this.stateInfo.api_key !== undefined
    ) {
      const axiosConfig: AxiosRequestConfig = {
        baseURL: "https://www.e621.net/",
        method: method,
        url: query_url,
        headers: { "User-Agent": this.stateInfo.userAgent },
        auth: {
          username: this.stateInfo.username!,
          password: this.stateInfo.api_key!,
        },
      };
      if (multipart !== undefined) {
        axiosConfig.headers["Content-Type"] = "multipart/form-data";
        axiosConfig.data = multipart;
      }
      return this.stateInfo.ratelimiter.schedule(() => axios(axiosConfig));
    } else {
      const axiosConfig: AxiosRequestConfig = {
        baseURL: "https://www.e621.net/",
        method: "get",
        url: query_url,
        headers: { "User-Agent": this.stateInfo.userAgent },
      };
      if (multipart !== undefined) {
        axiosConfig.headers["Content-Type"] = "multipart/form-data";
        axiosConfig.data = multipart;
      }
      return this.stateInfo.ratelimiter.schedule(() => axios(axiosConfig));
    }
  };
}
