import { Method } from "./interfaces";
import fs from "fs";

export interface ModelRequestArgs {
  query_url: string;
  method: Method;
}

export interface PostCreateArgs {
  tag_string: string[];
  file?: fs.ReadStream;
  rating: "s" | "q" | "e";
  direct_url?: string;
  source?: string;
  description?: string;
  parent_id?: number;
  referer_url?: string;
  md5_confirmation?: string;
  as_pending?: boolean;
}
