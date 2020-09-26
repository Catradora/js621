const axios = require("axios");
const Bottleneck = require("bottleneck");

async function sendRequest() {
  return axios({
    method: "get",
    headers: { "User-Agent": "Hood.noah@gmail.com" },
    url: "https://www.e621.net/posts.json?",
  });
}

const limiter = new Bottleneck({ minTime: 2000, maxConcurrent: 1 });

async function getData() {
  for (i = 0; i < 10; i++) {
    result = await limiter.schedule(sendRequest);
    console.log(result.data.posts[0].id + "|" + Date.now());
  }
}

getData();
