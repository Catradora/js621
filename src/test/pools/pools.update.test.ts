import { Pools } from "../../lib/models/pools";
import { StateInfo } from "../../lib/models/interfaces";
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

  it("should reject a call to update a post without logging in", async () => {
    //Arrange
    testPools = new Pools(test_state_info);

    //Act
    try {
      await testPools.update({ id: 12345 });
    } catch (err) {
      expect(err).toEqual(new Error("Must be logged in to update a pool."));
    }
  });

  it("should submit a call to update a post with all arguments", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    const expected_query_args: string[] = [
      "pool[name]=test pool",
      "pool[description]=test description",
      "pool[post_ids]=12345 12346",
      "pool[is_active]=1",
      "pool[category]=series",
    ].sort();
    const expected_query_url: string =
      "pools/12345.json?" + expected_query_args.join("&");

    //Act
    await testPools.update({
      id: 12345,
      name: "test pool",
      description: "test description",
      post_ids: [12345, 12346],
      is_active: true,
      category: "series",
    });

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "put",
    });
  });

  it("should correctly parse is_locked argument", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    const expected_query_url: string = "pools/12345.json?pool[is_active]=0";

    //Act
    await testPools.update({
      id: 12345,
      is_active: false,
    });

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "put",
    });
  });

  it("should submit a request to update a pool without any non-required arguments", async () => {
    //Arrange
    test_state_info.username = "test_username";
    test_state_info.api_key = "test_api_key";
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    const expected_query_url: string = "pools/12345.json?";

    //Act
    await testPools.update({
      id: 12345,
    });

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: expected_query_url,
      method: "put",
    });
  });
});
