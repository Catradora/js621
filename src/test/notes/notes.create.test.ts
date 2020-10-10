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

  it("should require login to create a note", async () => {
    //Arrange
    testNotes = new Notes(test_state_info);

    //Act
    try {
      await testNotes.create({
        post_id: 12345,
        x: 1,
        y: 2,
        width: 100,
        height: 100,
        body: "test body",
      });
    } catch (err) {
      expect(err).toEqual(new Error("Must be logged in to create a note."));
    }
  });

  it("should require login to create a note", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testNotes = new Notes(test_state_info);
    testNotes.submit_request = jest.fn();

    //Act
    await testNotes.create({
      post_id: 12345,
      x: 1,
      y: 2,
      width: 100,
      height: 100,
      body: "test body",
    });

    expect(testNotes.submit_request).toHaveBeenCalledWith({
      query_url:
        "notes.json?note[body]=test body&note[height]=100&note[post_id]=12345&note[width]=100&note[x]=1&note[y]=2",
      method: "post",
    });
  });
});
