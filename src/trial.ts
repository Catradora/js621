import { JS621 } from "./index";

let js621: JS621 = new JS621("hood.noah@gmail.com | JS621 Dev");

async function makeRequest() {
  try {
    let response = await js621.posts.submit_throttled_request(
      "https://www.e621.net/posts.json?",
      "get"
    );
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

makeRequest();
