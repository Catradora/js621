import axios, { AxiosRequestConfig } from "axios";
import Bottleneck from "bottleneck";
import { StateInfo, Method } from "./interfaces";

export class Model {
  public stateInfo: StateInfo;
  private modelLimiter: Bottleneck;

  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
    this.modelLimiter = new Bottleneck({ minTime: 1000 });
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
      return this.modelLimiter.schedule(() => axios(axiosConfig));
    } else {
      const axiosConfig: AxiosRequestConfig = {
        method: "get",
        url: query_url,
        headers: { "User-Agent": this.stateInfo.userAgent },
      };
      return this.modelLimiter.schedule(() => axios(axiosConfig));
    }
  };
}
