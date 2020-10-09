import { Tags } from "../../models/tags";
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
let testTags: Tags;

describe("tags", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
  });

  it("should list tags, given no arguments", async () => {
    //Arrange
    testTags = new Tags(test_state_info);
    testTags.submit_request = jest.fn();

    //Act
    await testTags.list({});

    //Assert
    expect(testTags.submit_request).toHaveBeenLastCalledWith({
      query_url: "tags.json?",
      method: "get",
    });
  });

  it("should list tags, given all arguments and a page", async () => {
    //Arrange
    testTags = new Tags(test_state_info);
    testTags.submit_request = jest.fn();

    //Act
    await testTags.list({
      name_matches: "horse*",
      category: "artist",
      order: "date",
      hide_empty: true,
      has_wiki: true,
      has_artist: true,
      limit: 100,
      page: 1,
    });

    let expected_args: string[] = [
      "search[name_matches]=horse*",
      "search[category]=artist",
      "search[order]=date",
      "search[hide_empty]=true",
      "search[has_wiki]=true",
      "search[has_artist]=true",
      "limit=100",
      "page=1",
    ].sort();

    //Assert
    expect(testTags.submit_request).toHaveBeenCalledWith({
      query_url: "tags.json?" + expected_args.join("&"),
      method: "get",
    });
  });

  it("should limit to a maximum of 1,000", async () => {
    //Arrange
    testTags = new Tags(test_state_info);
    testTags.submit_request = jest.fn();

    //Act
    await testTags.list({
      limit: 1001,
    });

    //Assert
    expect(testTags.submit_request).toHaveBeenCalledWith({
      query_url: "tags.json?limit=1000",
      method: "get",
    });
  });

  it("should submit an after page query", async () => {
    //Arrange
    testTags = new Tags(test_state_info);
    testTags.submit_request = jest.fn();

    //Act
    await testTags.list({
      after_page: 1,
    });

    //Assert
    expect(testTags.submit_request).toHaveBeenCalledWith({
      query_url: "tags.json?page=a1",
      method: "get",
    });
  });

  it("should submit a before page query", async () => {
    //Arrange
    testTags = new Tags(test_state_info);
    testTags.submit_request = jest.fn();

    //Act
    await testTags.list({
      before_page: 1,
    });

    //Assert
    expect(testTags.submit_request).toHaveBeenCalledWith({
      query_url: "tags.json?page=b1",
      method: "get",
    });
  });
});
