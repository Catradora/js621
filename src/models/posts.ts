import { StateInfo } from "./interfaces";
import { PostCreateArgs } from "./argumentTypes";
import { Model } from "./model";
import FormData from "form-data";
import * as fs from "fs";

export class Posts extends Model {
  constructor(stateInfo: StateInfo) {
    super(stateInfo);
  }

  create = async ({
    tag_string,
    file,
    filename,
    rating,
    direct_url,
    source,
    description,
    parent_id,
    referer_url,
    md5_confirmation,
    as_pending,
  }: PostCreateArgs) => {
    const query_args = {} as any;
    let query_url: string;
    let formData: FormData | undefined = undefined;

    if (as_pending !== undefined) {
      query_args["upload[as_pending]"] = as_pending;
    }

    if (description !== undefined) {
      query_args["upload[description]"] = description;
    }

    if (this.is_direct_url(file, filename, direct_url)) {
      query_args["upload[direct_url]"] = direct_url!;
    } else {
      formData = new FormData();
      formData.append(filename!, file!);
    }

    if (md5_confirmation !== undefined) {
      query_args["upload[md5_confirmation]"] = md5_confirmation;
    }

    if (parent_id !== undefined) {
      query_args["upload[parent_id]"] = parent_id;
    }

    query_args["upload[rating]"] = rating;

    if (referer_url !== undefined) {
      query_args["upload[referer-url]"] = referer_url;
    }

    query_args["upload[source]"] = this.parse_source(source);

    let tags: string = tag_string.join(" ");
    query_args["upload[tag_string]"] = tags;

    query_url = this.generate_query_url(query_args);

    return this.submit_request({
      query_url: query_url,
      method: "post",
      multipart: formData,
    });
  };

  private is_direct_url = (
    file?: fs.ReadStream,
    filename?: string,
    direct_url?: string
  ) => {
    //Determine if even elligible
    if (
      file === undefined &&
      filename === undefined &&
      direct_url === undefined
    ) {
      throw "Either file and filename must be supplied, or direct_url must be supplied. Not none.";
    } else if (file !== undefined && filename === undefined) {
      throw "If file is provided, so too must filename be provided, e.g. 'image.png'";
    } else if (file === undefined && filename !== undefined) {
      throw "If filename is provided, so too must file be provided, as a FormData object.";
    }

    if (direct_url !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  private parse_source = (source?: string) => {
    if (source === undefined) {
      return "";
    } else {
      return source!;
    }
  };

  private generate_query_url = (query_args: {}) => {
    let query_terms: string[] = [];
    let query_elements = Object.entries(query_args);
    for (let i = 0; i < query_elements.length; i++) {
      query_terms.push(query_elements[i].join("="));
    }
    return "uploads.json?" + query_terms.join("&");
  };
}
