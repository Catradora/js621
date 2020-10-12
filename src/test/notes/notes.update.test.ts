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

  it("should reject a call to update a note without logging in", async () => {
    //Arrange
    testNotes = new Notes(test_state_info);

    //Act
    try {
      await testNotes.update({
        note_id: 12345,
        x: 1,
        y: 2,
        width: 100,
        height: 200,
        body: "test body",
      });
    } catch (err) {
      expect(err).toEqual(new Error("Must be logged in to update a note."));
    }
  });

  it("should update a note with all arguments", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testNotes = new Notes(test_state_info);
    testNotes.submit_request = jest.fn();

    const expected_calls = [
      "note[x]=1",
      "note[y]=2",
      "note[width]=100",
      "note[height]=200",
      "note[body]=test body",
    ].sort();
    const expected_query_url = "notes/12345.json?" + expected_calls.join("&");

    //Act
    await testNotes.update({
      note_id: 12345,
      x: 1,
      y: 2,
      width: 100,
      height: 200,
      body: "test body",
    });

    //Assert
    expect(testNotes.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "put",
    });
  });
});
