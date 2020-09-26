import axios, { AxiosRequestConfig } from "axios";
import Bottleneck from "bottleneck";
import { StateInfo, Method } from "./interfaces";

export class Model {
  public stateInfo: StateInfo;
  //private throttledResponse: any;

  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
  }

  private modelLimiter: Bottleneck = new Bottleneck({ minTime: 1000 });

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
      //const result = await limiter.schedule(() => myFunction(arg1, arg2));
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

  // public submit_throttled_request = (url: string, method: Method) => {
  //   return this.stateInfo.rateLimiter.schedule(
  //     this.submit_request,
  //     url,
  //     method
  //   );
  // };
}
