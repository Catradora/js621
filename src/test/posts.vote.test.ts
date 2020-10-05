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

  it("should reject voting without login", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    try {
      await testPosts.vote({ post_id: 12345, score: 1 });
    } catch (err) {
      expect(err).toEqual(
        new Error("Must provide both username and api_key to flag a post")
      );
    }
  });

  it("should upvote a post with login", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.vote({ post_id: 12345, score: 1 });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts/12345/votes.json?score=1",
      method: "post",
    });
  });

  it("should downvote a post with login", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.vote({ post_id: 12345, score: -1 });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts/12345/votes.json?score=-1",
      method: "post",
    });
  });

  it("should upvote a post with login and no_unvote", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.vote({ post_id: 12345, score: -1, no_unvote: false });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts/12345/votes.json?no_unvote=false&score=-1",
      method: "post",
    });
  });
});
