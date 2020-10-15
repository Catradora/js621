import { Posts } from "../../lib/models/posts";
import { StateInfo } from "../../lib/models/interfaces";
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

  it("Should list all flags given no arguments", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list_flags({});

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "post_flags.json?",
      method: "get",
    });
  });

  it("Should list all flags given all arguments", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list_flags({
      post_id: 12345,
      creator_id: 12345,
      creator_name: "creator",
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url:
        "post_flags.json?search[creator_id]=12345&search[creator_name]=creator&search[post_id]=12345",
      method: "get",
    });
  });

  it("Should create a flag given only the two necessary parameters", async () => {
    //Arrange

    //Login
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";

    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.create_flag({
      post_id: 12345,
      reason_name: "inferior",
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url:
        "post_flags.json?post_flag[post_id]=12345&post_flag[reason_name]=inferior",
      method: "post",
    });
  });

  it("Should create a flag given all parameters", async () => {
    //Arrange

    //Login
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";

    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.create_flag({
      post_id: 12345,
      reason_name: "inferior",
      parent_id: 12344,
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url:
        "post_flags.json?post_flag[post_id]=12345&post_flag[parent_id]=12344&post_flag[reason_name]=inferior",
      method: "post",
    });
  });

  it("Should reject creating a flag without logging in", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act/assert
    try {
      await testPosts.create_flag({
        post_id: 12345,
        reason_name: "inferior",
      });
    } catch (err) {
      expect(err).toEqual(
        new Error("Must provide both username and api_key to flag a post")
      );
    }
  });
});
