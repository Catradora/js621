import axios, { AxiosRequestConfig } from "axios";
import { StateInfo } from "./interfaces";
import { ModelRequestArgs as RequestArgs } from "./argumentTypes";

export class Model {
  public stateInfo: StateInfo;

  /**
   * Model class; parent class to all worker objects. Used to submit requests, etc.
   * @param {dictionary} stateInfo - Dictionary containing user-agent, rate limiter, and username/API key if logged in.
   */
  constructor(stateInfo: StateInfo) {
    // Preserve rate limiter, user agent, etc.
    this.stateInfo = stateInfo;
  }

  /**
   * Send a request to the e621.net servers.
   * @param {string} query_url - The query url, not including 'https://www.e621.net'
   * @param {string} method - One of the valid HTTP methods, e.g. POST, PUT, DELETE.
   * @param multipart - A stream object, used for uploading files to the e621.net server.
   * @returns - A rate-limited promise, the completion of which contains the response from the server.
   */
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
        method: method,
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

  /**
   * Produces an ampersand-delimited string of arguments for passing through to submit_request.
   * @param query_args - A dictionary containing keys in the form of parameter names, and values representing their arguments.
   * @returns - An ampersand-delimited string of arguments for passing through to submit_request.
   */
  protected generate_query_url = (query_args: {}) => {
    let query_terms: string[] = [];
    let query_elements = Object.entries(query_args);
    for (let i = 0; i < query_elements.length; i++) {
      query_terms.push(query_elements[i].join("="));
    }
    return query_terms.join("&");
  };

  /**
   * Checks the state-info dictionary to determine if the user is fully logged-in.
   * @returns True if logged in, false if not
   */
  public is_logged_in = () => {
    if (
      this.stateInfo.username === undefined ||
      this.stateInfo.api_key === undefined
    ) {
      return false;
    }
    return true;
  };
}
