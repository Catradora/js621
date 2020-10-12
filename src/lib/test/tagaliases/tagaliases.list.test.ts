import { TagAliases } from "../../models/tagAliases";
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
let testTagAliases: TagAliases;

describe("tagaliases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
  });

  it("should submit a request given all args", async () => {
    //Arrange
    testTagAliases = new TagAliases(test_state_info);
    testTagAliases.submit_request = jest.fn();

    //Act
    await testTagAliases.list({
      name_matches: "horse*",
      order: "name",
      antecedent_tag_category: "general",
      consequent_tag_category: "general",
      limit: 10,
      page: 1,
      status: "approved",
    });

    const expected_args = [
      "search[name_matches]=horse*",
      "search[order]=name",
      "search[antecedent_tag][category]=0",
      "search[consequent_tag][category]=0",
      "limit=10",
      "page=1",
      "search[status]=approved",
    ].sort();

    //Assert
    expect(testTagAliases.submit_request).toHaveBeenCalledWith({
      query_url: "tag_aliases.json?" + expected_args.join("&"),
      method: "get",
    });
  });

  it("should submit a request given no args", async () => {
    //Arrange
    testTagAliases = new TagAliases(test_state_info);
    testTagAliases.submit_request = jest.fn();

    //Act
    await testTagAliases.list({});

    //Assert
    expect(testTagAliases.submit_request).toHaveBeenCalledWith({
      query_url: "tag_aliases.json?",
      method: "get",
    });
  });

  it("should impose a maximum limit of 1000", async () => {
    //Arrange
    testTagAliases = new TagAliases(test_state_info);
    testTagAliases.submit_request = jest.fn();

    //Act
    await testTagAliases.list({
      limit: 1001,
    });

    //Assert
    expect(testTagAliases.submit_request).toHaveBeenCalledWith({
      query_url: "tag_aliases.json?limit=1000",
      method: "get",
    });
  });

  it("should limit page to a maximum of 750", async () => {
    //Arrange
    testTagAliases = new TagAliases(test_state_info);
    testTagAliases.submit_request = jest.fn();

    //Act
    await testTagAliases.list({
      page: 751,
    });

    //Assert
    expect(testTagAliases.submit_request).toHaveBeenCalledWith({
      query_url: "tag_aliases.json?page=750",
      method: "get",
    });
  });

  it("should submit a before_page request", async () => {
    //Arrange
    testTagAliases = new TagAliases(test_state_info);
    testTagAliases.submit_request = jest.fn();

    //Act
    await testTagAliases.list({
      before_page: 10,
    });

    //Assert
    expect(testTagAliases.submit_request).toHaveBeenCalledWith({
      query_url: "tag_aliases.json?page=b10",
      method: "get",
    });
  });

  it("should submit an after_page request", async () => {
    //Arrange
    testTagAliases = new TagAliases(test_state_info);
    testTagAliases.submit_request = jest.fn();

    //Act
    await testTagAliases.list({
      after_page: 10,
    });

    //Assert
    expect(testTagAliases.submit_request).toHaveBeenCalledWith({
      query_url: "tag_aliases.json?page=a10",
      method: "get",
    });
  });
});
