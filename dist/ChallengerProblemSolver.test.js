"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChallengeProblemSolver_1 = require("./ChallengeProblemSolver");
const chai_1 = require("chai");
describe("ChallengeProblemSolver.solveProblem", () => {
    it("should return 4", () => {
        const challengeProblemSolver = new ChallengeProblemSolver_1.ChallengeProblemSolver();
        chai_1.expect(challengeProblemSolver.solveProblem([1, 2, 3])).to.equal(4);
    });
});
//# sourceMappingURL=ChallengerProblemSolver.test.js.map