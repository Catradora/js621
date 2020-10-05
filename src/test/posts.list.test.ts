import { Posts } from "../models/posts";
import { StateInfo } from "../models/interfaces";
import Bottleneck from "bottleneck";

jest.mock("axios"); //Prevent any calls to the wider net

//Set up mocking of FormData, since we don't really want it to create a new FormData object
const mockAppend = jest.fn();
jest.mock("form-data", () => {
  return jest.fn().mockImplementation(() => {
    return {
      append: mockAppend,
    };
  });
});

//Setup global variables
let test_state_info: StateInfo;
let testPosts: Posts;

describe("posts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
  });

  it("should list posts provided no arguments", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list();

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts.json?",
      method: "get",
      multipart: undefined,
    });
  });
});
