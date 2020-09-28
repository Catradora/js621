import { StateInfo } from "./interfaces";
import { Model } from "./model";

export class Posts extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }
}
