import { Pools } from "../../lib/models/pools";
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
let testPools: Pools;

describe("pools", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    test_state_info = {
      ratelimiter: new Bottleneck({ minTime: 0 }),
      userAgent: "email@website.com",
    };
  });

  it("should reject calls to revert without logging in", async () => {
    //Arrange
    testPools = new Pools(test_state_info);

    //Act
    try {
      await testPools.revert({ id: 12345, version_id: 12345 });
    } catch (err) {
      expect(err).toEqual(new Error("Must be logged in to revert a pool."));
    }
  });

  it("should revert a post given all arguments", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    //Act
    await testPools.revert({ id: 12345, version_id: 12345 });

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: "pools/12345/revert.json?version_id=12345",
      method: "put",
    });
  });
});
