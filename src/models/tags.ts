import { Model } from "./model";
import { StateInfo } from "./interfaces";
import { TagListArgs } from "./argumentTypes";

export class Tags extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  list = async ({
    name_matches,
    category,
    order,
    hide_empty,
    has_wiki,
    has_artist,
    limit,
    page,
  }: TagListArgs) => {
    let;
  };
}
