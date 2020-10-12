import { Notes } from "../../models/notes";
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
let testNotes: Notes;

describe("notes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
  });

  it("should reject calls to revert without logging in", async () => {
    //Arrange
    testNotes = new Notes(test_state_info);

    //Act
    try {
      await testNotes.revert({ note_id: 12345, version_id: 12345 });
    } catch (err) {
      expect(err).toEqual(new Error("Must be logged in to revert a note."));
    }
  });

  it("should revert a post given all arguments", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testNotes = new Notes(test_state_info);
    testNotes.submit_request = jest.fn();

    //Act
    await testNotes.revert({ note_id: 12345, version_id: 12345 });

    //Assert
    expect(testNotes.submit_request).toHaveBeenCalledWith({
      query_url: "notes/12345/revert.json?version_id=12345",
      method: "put",
    });
  });
});
