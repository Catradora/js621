import { Posts } from "../../models/posts";
import { StateInfo } from "../../models/interfaces";
import Bottleneck from "bottleneck";
import { ModelRequestArgs } from "../../models/argumentTypes";

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

  it("should instantiate with the correct state_info", () => {
    testPosts = new Posts(test_state_info);
    expect(testPosts.stateInfo).toBe(test_state_info);
  });

  it("should update a post provided all parameters, while logged in", async () => {
    //Arrange

    //Login
    test_state_info.username = "fake_username";
    test_state_info.api_key = "fake_api_key";
    testPosts = new Posts(test_state_info);

    //Mock-out requests
    testPosts.submit_request = jest.fn();

    //Produce expected calls
    let expected_query_terms: string[] = [
      "post[description]=new description",
      "post[edit_reason]=updated tags, etc.",
      "post[has_embedded_notes]=false",
      "post[is_note_locked]=false",
      "post[is_rating_locked]=false",
      "post[old_description]=old description",
      "post[old_parent_id]=12344",
      "post[old_rating]=q",
      "post[parent_id]=12345",
      "post[rating]=s",
      "post[source_diff]=website1.ext\nwebsite2.ext",
      "post[tag_string_diff]=horse -cat",
    ];
    let expected_args: ModelRequestArgs = {
      query_url: "posts/12344.json?" + expected_query_terms.join("&"),
      method: "patch",
      multipart: undefined,
    };

    //Act
    await testPosts.update({
      post_id: 12344,
      tag_string_diff: ["horse", "-cat"],
      source_diff: ["website1.ext", "website2.ext"],
      parent_id: 12345,
      old_parent_id: 12344,
      description: "new description",
      old_description: "old description",
      rating: "s",
      old_rating: "q",
      is_rating_locked: false,
      is_note_locked: false,
      edit_reason: "updated tags, etc.",
      has_embedded_notes: false,
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith(expected_args);
  });

  it("should update a post provided no optional parameters, while logged in", async () => {
    //Arrange

    //Login
    test_state_info.username = "fake_username";
    test_state_info.api_key = "fake_api_key";
    testPosts = new Posts(test_state_info);

    //Mock-out requests
    testPosts.submit_request = jest.fn();

    //Produce expected calls
    let expected_query_terms: string[] = [];
    let expected_args: ModelRequestArgs = {
      query_url: "posts/12344.json?" + expected_query_terms.join("&"),
      method: "patch",
      multipart: undefined,
    };

    //Act
    await testPosts.update({
      post_id: 12344,
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith(expected_args);
  });

  it("should reject a call to update without logging in", async () => {
    //Arrange

    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    try {
      await testPosts.update({
        post_id: 12344,
        tag_string_diff: ["horse", "-cat"],
        source_diff: ["website1.ext", "website2.ext"],
        parent_id: 12345,
        old_parent_id: 12344,
        description: "new description",
        old_description: "old description",
        rating: "s",
        old_rating: "q",
        is_rating_locked: false,
        is_note_locked: false,
        edit_reason: "updated tags, etc.",
        has_embedded_notes: false,
      });
    } catch (err) {
      expect(err).toEqual(
        new Error("Must provide both username and api_key to update a post")
      );
    }
  });
});
