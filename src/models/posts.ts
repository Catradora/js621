import { StateInfo } from "./interfaces";
import { PostCreateArgs } from "./argumentTypes";
import { Model } from "./model";

export class Posts extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  create = async ({}: PostCreateArgs) => {};
}
