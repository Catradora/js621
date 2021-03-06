# JS621

JS621 is a TypeScript wrapper for the <a href=https://www.e621.net/help/api>e621.net API</a>.

The purpose of this API wrapper is to provide a user-friendly means for getting and changing information stored on the e621.net server, e.g. downloading posts, uploading posts, creating pools, etc.

# Caveats

This wrapper is complete insofar as it wraps each method of the e621.net API as specified on the website's API reference. However, due to the nature of the website, not all methods are possible to test. Namely, the methods which are unverified are those methods which change state on the website, e.g. creating posts, creating pools, etc.

This is due to the fact that the website prevents users from deleting posts, i.e. if one were to fully test `Posts.create({})`, one would have to create a post on the website which they could not subsequently delete, which would require site moderator attention.

As such, if problems arise and implementation details are incorrect, _please_ create an issue and explain the problem and a proposed solution. Without real users testing this API wrapper, it is impossible to verify it works as intended.

Further, the API itself is still under development. As such, the endpoints are subject to change. This wrapper cannot be fully stable until development is finished on the API itself.

# Usage

The API wrapper is designed to be easy-to-use.

## Documentation

Find the documentation for this wrapper <a href="https://catradora.github.io/js621/">here</a>.

## Importing

Import the package, either from node_modules (after installing), or after cloning the repository.

```typescript
import { JS621 } from "js621";
```

## Instantiation

All API endpoints are accessed through a master `JS621` object. This object requires the presentation of a `user-agent`. Per the
<a href=https://www.e621.net/help/api>API documentation</a>, this user-agent must be _descriptive._ This means, in essence, it must provide a means to identify and contact you, should your use of the API cause issues for the e621.net site maintainers.

A good format to use (bearing in mind there is a limit to how long the user-agent string can be) is as follows:

`username@website.com | ProjectName`

The <a href=https://www.e621.net/help/api>API documentation</a> makes clear that users are _not_ to imitate browser user-agents if using scripts to access the API, such behavior _will get you banned._

The master object is created as follows:

```typescript
import { JS621 } from "js621";

const user_agent: string = "email@website.com | ProjectName";
const wrapper = new JS621(user_agent);
```

## Endpoints

This wrapper provides access to the 5 main endpoints within the <a href=https://www.e621.net/help/api>e621.net API</a>:

- Posts
- Pools
- Tags
- TagAliases
- Notes

The endpoints are represented by attributes on the master class. Thus, accessing each of their methods is accomplished in the following fashion:

```typescript
import { JS621 } from "js621";

const user_agent: string = "email@website.com | ProjectName";
const wrapper = new JS621(user_agent);

//Access the posts object
const posts = wrapper.posts;

//Access the pools object
const pools = wrapper.pools;

//Access the tags object
const tags = wrapper.tags;

//Access the tagAliases object
const tagAliases = wrapper.tagAliases;

//Access the notes object
const notes = wrapper.notes;
```

### Sub-Endpoints

Each object provides its own set of endpoints. For example, the `posts` object provides access to the following endpoints:

- list
- create
- update
- list_flags
- create_flag
- vote

The behaviors of each are presented on the <a href=https://www.e621.net/help/api>e621.net API</a>.

For example, `list` provides a list of posts, based on search provided as an argument dictionary. It can be used as follows:

```typescript
import { JS621 } from "js621";

const user_agent: string = "email@website.com | ProjectName";
const wrapper = new JS621(user_agent);

let getPosts = async () => {
  const posts = wrapper.posts;
  let result = await posts.list({
    tags: ["horse", "rating:s", "order:score"],
    limit: 1,
  });

  console.log(result.data);
};
getPosts();
```

The above code does the following:

1. Creates a JS621 master object with a _descriptive_ user-agent
2. Creates an _asynchronous_ function, which gets a list of posts whose tags contain 'horse' whose rating is safe, and orders it by score. It further _limits_ the results to 1, so we only see one post.
3. Prints those results

## Async

For those unfamiliar with JavaScript/TypeScript and Node.js in particular, the use of an `async` function may be confusing. The use of async programming was an intentional design choice. All actions which interact with the e621.net API are _asynchronous,_ which means they do not block execution of code while they themselves execute. This is generally done when making web requests since they are, in the context of computer operations, slow. For more information about promises, async/await, and asynchronous programming in JavaScript/TypeScript, check out <a href=https://medium.com/jspoint/javascript-promises-and-async-await-as-fast-as-possible-d7c8c8ff0abc>this article.</a>

The main takeaway is that calls to the JS621 API wrapper must be handled in one of two ways. The first, and simpler of the two, is to wrap calls to the API in an `async` function, as shown in the above code fragment.

### Promises

The second, and slightly more complicated method, is to handle it as a `Promise`. This obviates the need for an asynchronous function:

```typescript
import { JS621 } from "js621";

const user_agent: string = "email@website.com | ProjectName";
const wrapper = new JS621(user_agent);
const posts = wrapper.posts;

//Result is a *promise*
let result = posts.list({
  tags: ["horse", "order:score", "rating:s"],
  limit: 1,
});

//.then lets us wait for the promise to *resolve*
result.then((resolution) => {
  console.log(resolution.data);
});

//.catch covers what happens if the promise doesn't resolve
result.catch((err) => {
  console.log(err);
});
```

The purpose of wrapping these calls in asynchronous methods is to speed up execution. Each call needs not wait on the previous call's completion to begin its work. If one call takes a long time, several others can be completed while waiting on the first.

## Rate-Limiting

However, this would generally permit the code to submit requests at an extremely high rate. The <a href=https://www.e621.net/help/api>e621.net API</a> notes that there is a rate limit of 2 requests per second. They further note that hitting the rate limit of 2/second indicates you're actually _still_ going too quickly, and should instead aim for 1 request/second.

As such, the JS621 API wrapper automatically limits all requests to the API to one per second asynchronously.

This is considered the maximum speed for accessing the <a href=https://www.e621.net/help/api>e621.net API</a>. Attempts to circumvent this limit will get your script throttled, and excessive misuse will result in your ip address being banned from e621.net.

So keep it safe, and just let the API wrapper keep you under 1/second.

## Authentication

Furthermore, there are two "genres" of requests which can be made on the e621.net API: those that simply read information, and those that manipulate information.

The simplest example is with the `Posts` endpoint: you can _read information_ (`Posts.list({})`), and you can _manipulate information_ (`Posts.create({})`).

Requests that just read information do not require the user to be logged in. Note, however, that there are universal blacklists on the e621.net site, which require being logged-in to see when searching posts, etc. In order to get these results, you must be logged in _even for requests that just read information._

Requests that manipulate information _do_ require the user to be logged in. Failure to login prior to performing these requests will automatically throw an Error without submitting a request to the server.

Logging in is accomplished through the JS621 master object, like so:

```typescript
import { JS621 } from "js621";

const user_agent: string = "email@website.com | ProjectName";
const wrapper = new JS621(user_agent);

wrapper.login("username", "api_key");

wrapper.posts
  .create({...})
  .then((response) => {
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err);
  });
```

## Logging Out

When you finish with requests which require login, you are free to `logout` by calling the eponymous function within the master object.

```typescript
import { JS621 } from "js621";

const user_agent: string = "email@website.com | ProjectName";
const wrapper = new JS621(user_agent);

wrapper.login("username", "api_key");

wrapper.posts
  .create({...})
  .then((response) => {
    console.log(response.data);
  })
  .catch((err) => {
    console.log(err);
  });

wrapper.logout();
```

## Downloading

A key use-case for this API wrapper is to download files directly from e621.net. While making these requests is relatively simple, given the need to rate-limit requests, it seemed a clear choice to bake a method for scheduling downloads directly into the API.

To download a file, the following code pattern will work nicely. Keep in mind, however, that the API wrapper is simply returning a stream of the file's contents which can be handled as the end-user sees fit. What follows is just one such method.

```typescript
import { JS621 } from "js621";
import fs from "fs";

const wrapper: JS621 = new JS621("email@website.com | ProjectName");

let fileWriter: WriteStream = fs.createWriteStream(
  "path/to/images/TestFile.png"
);

wrapper.posts
  .schedule_download(
    "https://static1.e621.net/data/c0/fa/c0fa5293f1d1440c2d3f2c3e027d3c36.jpg"
  )
  .then((res) => res.data.pipe(fileWriter))
  .catch((err) => console.log(err));
```

## General Tips

### Traversing many objects

There are a few best practices to note when using the e621.net API. If you intend to traverse a large number of objects (posts, tags, etc.), rather than using the `page` parameter of `Posts.list()`, you should use the `before_page` and/or `after_page` parameters.

These parameters take ID numbers, limiting the results to those with an ID higher or lower than the given parameter.

Thus, to gather information about many posts, simply list your results, and then request `before_page` or `after_page` with the highest/lowest ID number returned by the previous request.
