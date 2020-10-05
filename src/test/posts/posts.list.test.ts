import { Posts } from "../../models/posts";
import { StateInfo } from "../../models/interfaces";
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
    await testPosts.list({});

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts.json?",
      method: "get",
      multipart: undefined,
    });
  });

  it("should list posts provided limit, tags, and page", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list({ limit: 320, tags: ["horse", "tail"], page: 2 });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts.json?limit=320&page=2&tags=horse tail",
      method: "get",
      multipart: undefined,
    });
  });

  it("should list posts provided limit, tags, and before_page", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list({
      limit: 320,
      tags: ["horse", "tail"],
      before_page: 12345,
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts.json?limit=320&page=b12345&tags=horse tail",
      method: "get",
      multipart: undefined,
    });
  });

  it("should list posts provided limit, tags, and after_page", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list({
      limit: 320,
      tags: ["horse", "tail"],
      after_page: 12345,
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts.json?limit=320&page=a12345&tags=horse tail",
      method: "get",
      multipart: undefined,
    });
  });

  it("should default all limits to a maximum of 320", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list({
      limit: 500,
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts.json?limit=320",
      method: "get",
      multipart: undefined,
    });
  });

  it("should default all pages to a maximum of 750", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.list({
      page: 800,
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: "posts.json?page=750",
      method: "get",
      multipart: undefined,
    });
  });
});
