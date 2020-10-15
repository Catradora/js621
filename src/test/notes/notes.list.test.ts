import { Notes } from "../../lib/models/notes";
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
let testNotes: Notes;

describe("notes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
  });

  it("should submit a request given no args", async () => {
    //Arrange
    testNotes = new Notes(test_state_info);
    testNotes.submit_request = jest.fn();

    //Act
    await testNotes.list({});

    //Assert
    expect(testNotes.submit_request).toHaveBeenCalledWith({
      query_url: "notes.json?",
      method: "get",
    });
  });

  it("should submit a request given all args", async () => {
    //Arrange
    testNotes = new Notes(test_state_info);
    testNotes.submit_request = jest.fn();

    //Act
    await testNotes.list({
      body_matches: "horse*",
      post_id: 12345,
      post_tags_match: ["horse*", "tail"],
      creator_name: "creatorname",
      creator_id: 12345,
      is_active: true,
      limit: 1000,
    });

    const expected_args = [
      "search[body_matches]=horse*",
      "search[post_id]=12345",
      "search[post_tags_match]=horse* tail",
      "search[creator_name]=creatorname",
      "search[creator_id]=12345",
      "search[is_active]=true",
      "limit=1000",
    ].sort();

    //Assert
    expect(testNotes.submit_request).toHaveBeenCalledWith({
      query_url: "notes.json?" + expected_args.join("&"),
      method: "get",
    });
  });

  it("should impose a maximum limit of 1000", async () => {
    //Arrange
    testNotes = new Notes(test_state_info);
    testNotes.submit_request = jest.fn();

    //Act
    await testNotes.list({
      limit: 2000,
    });

    //Assert
    expect(testNotes.submit_request).toHaveBeenCalledWith({
      query_url: "notes.json?limit=1000",
      method: "get",
    });
  });
});
