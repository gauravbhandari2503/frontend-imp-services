import BaseService from "../API-Service/baseApiService";

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, any>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export class GraphQLService {
  private static instance: GraphQLService;
  private readonly endpoint: string;

  private constructor() {
    // Assuming the graphql endpoint is mounted at /graphql relative to base URL
    // If VITE_API_BASE_URL is 'http://localhost:3000/api', this will be 'http://localhost:3000/api/graphql'
    // Or you can configure it specifically via env var if needed.
    this.endpoint = "graphql";
  }

  public static getInstance(): GraphQLService {
    if (!GraphQLService.instance) {
      GraphQLService.instance = new GraphQLService();
    }
    return GraphQLService.instance;
  }

  /**
   * Execute a GraphQL query
   * @param query - The GraphQL query string
   * @param variables - Optional variables for the query
   */
  public async query<T>(query: string, variables?: object): Promise<T> {
    return this.execute<T>(query, variables);
  }

  /**
   * Execute a GraphQL mutation
   * @param mutation - The GraphQL mutation string
   * @param variables - Optional variables for the mutation
   */
  public async mutate<T>(mutation: string, variables?: object): Promise<T> {
    return this.execute<T>(mutation, variables);
  }

  private async execute<T>(query: string, variables?: object): Promise<T> {
    try {
      const response = await BaseService.post<GraphQLResponse<T>>(
        this.endpoint,
        {
          query,
          variables,
        },
      );

      if (response.errors && response.errors.length > 0) {
        // Handle GraphQL errors (even if HTTP status is 200)
        const primaryError = response.errors[0];
        throw new Error(primaryError.message || "GraphQL Error");
      }

      if (!response.data) {
        throw new Error("No data returned from GraphQL query");
      }

      return response.data;
    } catch (error: any) {
      // If it's already an Error object with our message, rethrow
      // Otherwise wrap it or log it
      console.error("GraphQL execution error:", error);
      throw error;
    }
  }
}

export const graphqlService = GraphQLService.getInstance();
