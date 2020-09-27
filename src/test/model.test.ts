import { Model } from "../models/model";
import { expect } from "chai";
import Bottleneck from "bottleneck";
import { mocked } from "ts-jest";
import axios, { AxiosResponse } from "axios";

jest.mock("axios");

let expected_state_info = {
  ratelimiter: new Bottleneck({ minTime: 1000 }),
  userAgent: "email@website.com",
  userName: "username",
  api_key: "12345abcde",
};

let testModel: Model;

describe("model", () => {
  it("should initialize with stateInfo as provided", () => {
    testModel = new Model(expected_state_info);
    expect(testModel.stateInfo).to.equal(expected_state_info);
  });

  it("should submit get requests to a given URL without logging in", async () => {
    //Arrange
    const axiosResponse: AxiosResponse = {
      data: {
        posts: [
          {
            id: 12345,
            created_at: "2020-09-26T22:03:14.400-04:00",
            updated_at: "2020-09-26T22:03:30.847-04:00",
            file: {},
            preview: {},
            sample: {},
            score: {},
            tags: {},
            locked_tags: [],
            change_seq: 12345,
            flags: {},
          },
        ],
      },
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
    };

    mocked(axios).mockResolvedValue(axiosResponse); //Mocking axios function rather than a method

    testModel = new Model(expected_state_info);

    //Act
    const result = await testModel.submit_request(
      "https://www.e621.net/posts.json?limit=1",
      "get"
    );

    //Assert
    expect(result).to.equal({
      data: {
        posts: [
          {
            id: 12345,
            created_at: "2020-09-26T22:03:14.400-04:00",
            updated_at: "2020-09-26T22:03:30.847-04:00",
            file: {},
            preview: {},
            sample: {},
            score: {},
            tags: {},
            locked_tags: [],
            change_seq: 12345,
            flags: {},
          },
        ],
      },
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
    });
  });
});
