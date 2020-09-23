import { ChallengeProblemSolver } from "../ChallengeProblemSolver";
import { expect } from "chai";

describe("ChallengeProblemSolver.solveProblem", () => {
  it("should return 4", () => {
    const challengeProblemSolver = new ChallengeProblemSolver();
    expect(challengeProblemSolver.solveProblem([1, 2, 3])).to.equal(4);
  });
});
