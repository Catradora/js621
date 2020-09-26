import axios, { AxiosRequestConfig } from "axios";
import { StateInfo, Method } from "./interfaces";

export class Model {
  public stateInfo: StateInfo;

  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
  }

  //Updated to funcName = () => {} syntax to bind "this" to this class context.
  public submit_request = async (query_url: string, method: Method) => {
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
      return this.stateInfo.ratelimiter.schedule(() => axios(axiosConfig));
    } else {
      const axiosConfig: AxiosRequestConfig = {
        method: "get",
        url: query_url,
        headers: { "User-Agent": this.stateInfo.userAgent },
      };
      return this.stateInfo.ratelimiter.schedule(() => axios(axiosConfig));
    }
  };
}
