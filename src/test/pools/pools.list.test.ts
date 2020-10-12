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

  it("should list pools with no arguments", async () => {
    //Arrange
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    //Act
    await testPools.list({});

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: "pools.json?",
      method: "get",
    });
  });

  it("should list pools with all arguments", async () => {
    //Arrange
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    //Act
    await testPools.list({
      name_matches: "horse*",
      id: 12345,
      description_matches: "horse*",
      creator_name: "test_creator",
      creator_id: 123456,
      is_active: true,
      is_deleted: false,
      category: "series",
      order: "name",
      limit: 1000,
    });

    const expected_args: string[] = [
      "search[name_matches]=horse*",
      "search[id]=12345",
      "search[description_matches]=horse*",
      "search[creator_name]=test_creator",
      "search[creator_id]=123456",
      "search[is_active]=true",
      "search[is_deleted]=false",
      "search[category]=series",
      "search[order]=name",
      "limit=1000",
    ].sort();

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: "pools.json?" + expected_args.join("&"),
      method: "get",
    });
  });

  it("should impose a maximum limit of 1000", async () => {
    //Arrange
    testPools = new Pools(test_state_info);
    testPools.submit_request = jest.fn();

    //Act
    await testPools.list({
      limit: 2000,
    });

    //Assert
    expect(testPools.submit_request).toHaveBeenCalledWith({
      query_url: "pools.json?limit=1000",
      method: "get",
    });
  });
});
