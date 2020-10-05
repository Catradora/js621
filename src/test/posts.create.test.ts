import { Posts } from "../models/posts";
import { StateInfo } from "../models/interfaces";
import Bottleneck from "bottleneck";
import FormData from "form-data";
import * as fs from "fs";
import { ModelRequestArgs } from "../models/argumentTypes";

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

  it("should upload a post given username, api_key, and a direct_url", async () => {
    //Arrange

    //Login
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";

    //Create testPosts object, mock out call to "submit_request"
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    await testPosts.create({
      direct_url: "https://fileurl.ext",
      tag_string: ["image", "file"],
      rating: "s",
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url:
        "uploads.json?upload[direct_url]=https://fileurl.ext&upload[rating]=s&upload[source]=&upload[tag_string]=image file",
      method: "post",
    });
  });

  it("should submit post requests with form data with logging in", async () => {
    //Arrange

    //Login
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";

    //Create a stream
    const stream = fs.createReadStream("./src/test/fixtures/fakefile.png");

    //Setup Posts object, and FormData
    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    let formData: FormData = new FormData();
    formData.append("fakefile.png", stream);

    //Act
    await testPosts.create({
      tag_string: ["horse", "tail"],
      rating: "s",
      file: stream,
      filename: "fakefile.png",
    });

    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url:
        "uploads.json?upload[rating]=s&upload[source]=&upload[tag_string]=horse tail",
      method: "post",
      multipart: formData,
    });
  });

  it("should reject submitting a post without login information", async () => {
    //Arrange
    testPosts = new Posts(test_state_info);

    //Act
    expect.assertions(1);
    try {
      await testPosts.create({
        direct_url: "https://fileurl.ext",
        tag_string: ["image", "file"],
        rating: "s",
      });
    } catch (err) {
      expect(err).toEqual(
        new Error("Must provide both username and api_key to create a post")
      );
    }
  });

  it("should use all arguments supplied correctly", async () => {
    //Arrange

    //Login
    test_state_info.username = "fake_username";
    test_state_info.api_key = "fake_api_key";

    //Prepare expected url call
    let expected_args: string[] = [
      "upload[as_pending]=true",
      "upload[description]=fake description",
      "upload[direct_url]=fake_direct_url.ext",
      "upload[md5_confirmation]=fake_md5_sum",
      "upload[parent_id]=12345",
      "upload[rating]=s",
      "upload[referer_url]=fake_referer_url.ext",
      "upload[source]=fake_source.ext",
      "upload[tag_string]=horse tail",
    ];
    let expected_query_url = "uploads.json?" + expected_args.join("&");

    //Prepare posts object
    let testPosts: Posts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    //Act
    testPosts.create({
      tag_string: ["horse", "tail"],
      as_pending: true,
      description: "fake description",
      direct_url: "fake_direct_url.ext",
      md5_confirmation: "fake_md5_sum",
      parent_id: 12345,
      rating: "s",
      referer_url: "fake_referer_url.ext",
      source: "fake_source.ext",
    });

    //Assert
    expect(testPosts.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "post",
      multipart: undefined,
    });
  });

  it("should reject a create call without any file, filename, or direct_url provided", async () => {
    //Arrange

    //Login
    test_state_info.username = "fakeUsername";
    test_state_info.api_key = "fakeAPIKey";

    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    try {
      await testPosts.create({ tag_string: ["horse", "tail"], rating: "s" });
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "Either file and filename must be supplied, or direct_url must be supplied. Not none."
        )
      );
    }
  });

  it("should reject a create call without a filename, or direct_url provided", async () => {
    //Arrange

    //Login
    test_state_info.username = "fakeUsername";
    test_state_info.api_key = "fakeAPIKey";

    //Create stream
    let stream: fs.ReadStream = fs.createReadStream(
      "src/test/fixtures/fakefile.png"
    );

    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    try {
      await testPosts.create({
        tag_string: ["horse", "tail"],
        rating: "s",
        file: stream,
      });
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "If file is provided, so too must filename be provided, e.g. 'image.png'"
        )
      );
    }
  });

  it("should reject a create call without a file, or direct_url provided", async () => {
    //Arrange

    //Login
    test_state_info.username = "fakeUsername";
    test_state_info.api_key = "fakeAPIKey";

    testPosts = new Posts(test_state_info);
    testPosts.submit_request = jest.fn();

    try {
      await testPosts.create({
        tag_string: ["horse", "tail"],
        rating: "s",
        filename: "fakeFile.ext",
      });
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "If filename is provided, so too must file be provided, as an fs.ReadStream object."
        )
      );
    }
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
