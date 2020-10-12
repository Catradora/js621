import { Pools } from "../../models/pools";
import { StateInfo } from "../../models/interfaces";
import Bottleneck from "bottleneck";

jest.mock("axios"); //Prevent any calls to the wider net

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

  it("should reject creating a pool without logging in", async () => {
    //Arrange
    testPools = new Pools(test_state_info);

    //Act
    try {
      await testPools.create({
        name: "test_pool",
        description: "",
        category: "series",
        is_locked: true,
      });
    } catch (err) {
      expect(err).toEqual(new Error("Must be logged in to create a pool."));
    }
  });

  it("should create a pool with all arguments", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    //Act
    await testPools.create({
      name: "test pool",
      description: "",
      category: "series",
      is_locked: true,
    });

    const expected_calls: string[] = [
      "pool[name]=test pool",
      "pool[description]=",
      "pool[category]=series",
      "pool[is_locked]=1",
    ].sort();
    const expected_query_url = "pools.json?" + expected_calls.join("&");

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "post",
    });
  });

  it("should correctly parse the is_locked argument", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    //Act
    await testPools.create({
      name: "test pool",
      description: "test description",
      is_locked: false,
      category: "collection",
    });

    const expected_query_args = [
      "pool[name]=test pool",
      "pool[description]=test description",
      "pool[is_locked]=0",
      "pool[category]=collection",
    ].sort();
    const expected_query_url: string =
      "pools.json?" + expected_query_args.join("&");

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "post",
    });
  });

  it("should submit a request with only required args", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    //Act
    await testPools.create({
      name: "test pool",
      description: "test description",
    });

    const expected_query_args = [
      "pool[name]=test pool",
      "pool[description]=test description",
    ].sort();
    const expected_query_url: string =
      "pools.json?" + expected_query_args.join("&");

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "post",
    });
  });
});
