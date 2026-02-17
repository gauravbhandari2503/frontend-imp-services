# GraphQLService

The `GraphQLService` provides a streamlined way to interact with your GraphQL API. It is built on top of `BaseApiService` to ensure consistent authentication, error handling, and configuration.

## Overview

Unlike REST endpoints which use different HTTP methods and URLs, GraphQL interactions typically happen over a single POST endpoint. `GraphQLService` abstracts this, providing clean `query` and `mutate` methods.

### Key Features

- **Authentication**: Automatically uses `BaseApiService`, so all headers (Auth tokens, CSRF tokens) are included.
- **Error Unwrapping**: GraphQL APIs often return 200 OK even when there are errors. This service checks the `errors` array in the response and throws an error if present, so you don't have to check `if (data.errors)` every time.
- **Type Safety**: Methods are generic, allowing you to specify the expected return type of the query/mutation.

## How to Use

### 1. Basic Query

```typescript
import { graphqlService } from "@/GraphQl-Service/graphqlService";

interface UserResponse {
  user: {
    id: string;
    name: string;
  };
}

const query = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

async function fetchUser(id: string) {
  try {
    const data = await graphqlService.query<UserResponse>(query, { id });
    console.log(data.user.name);
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}
```

### 2. Mutation

```typescript
import { graphqlService } from "@/GraphQl-Service/graphqlService";

interface CreatePostResponse {
  createPost: {
    id: string;
    title: string;
  };
}

const mutation = `
  mutation CreatePost($title: String!, $content: String!) {
    createPost(input: { title: $title, content: $content }) {
      id
      title
    }
  }
`;

async function createNewPost() {
  try {
    const data = await graphqlService.mutate<CreatePostResponse>(mutation, {
      title: "New Post",
      content: "Hello World",
    });
    console.log("Created post:", data.createPost.id);
  } catch (error) {
    console.error("Mutation failed:", error);
  }
}
```

## Error Handling

The service simplifies error handling. If the GraphQL server returns an `errors` array, the service throws the first error message.

```typescript
try {
  await graphqlService.query(badQuery);
} catch (error) {
  // This will catch both network errors (40x, 500) AND GraphQL logic errors
  alert(error.message);
}
```

## Configuration

The service is configured to assume your GraphQL endpoint allows requests at `/graphql` relative to your `VITE_API_BASE_URL`.

If your base URL is `https://api.example.com/v1`, it will post to `https://api.example.com/v1/graphql`.

To change this, modify the `endpoint` property in `graphqlService.ts`.
