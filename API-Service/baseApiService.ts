import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import csrfService from "./csrfAPIService";

interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isStaging: boolean;
  environment: string;
  enableLogging: boolean;
  enableDetailedErrors: boolean;
  apiTimeout: number;
}

class BaseService {
  private static instance: BaseService;
  private readonly api: AxiosInstance;
  private readonly config: EnvironmentConfig;

  private constructor() {
    const env = (import.meta as any).env || {};

    // Environment detection and configuration
    this.config = this.initializeEnvironmentConfig(env);

    this.api = axios.create({
      baseURL: env.VITE_API_BASE_URL,
      timeout: this.config.apiTimeout,
      withCredentials: true, // Always true for cookie-based auth
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      headers: {
        // Don't set Content-Type here - let axios auto-detect based on data type
        // For JSON: axios will set 'application/json'
        // For FormData: axios will set 'multipart/form-data' with boundary
        Accept: "application/json",
        ...(this.config.isDevelopment && { "X-Debug-Mode": "true" }),
      },
    });

    this.setupInterceptors();
  }

  private initializeEnvironmentConfig(env: any): EnvironmentConfig {
    // Prefer explicit VITE_ENVIRONMENT; fallback to Vite MODE; then legacy vars
    const detected = String(
      env.VITE_APP_ENV || env.NODE_ENV || "development",
    ).toLowerCase();

    const isLocal = detected === "local";
    const isDevelopment = detected === "development" || isLocal;

    return {
      environment: detected,
      isDevelopment,
      isProduction: detected === "production",
      isStaging: detected === "staging",
      enableLogging:
        env.VITE_ENABLE_API_LOGGING !== "false" && detected !== "production",
      enableDetailedErrors: isDevelopment,
      apiTimeout: parseInt(env.VITE_API_TIMEOUT || "30000", 10),
    };
  }

  public static getInstance(): BaseService {
    if (!BaseService.instance) {
      BaseService.instance = new BaseService();
    }
    return BaseService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (!config.headers["X-XSRF-TOKEN"]) {
          if (
            ["post", "put", "patch", "delete"].includes(
              config.method?.toLowerCase() || "",
            )
          ) {
            try {
              await csrfService.ensureToken();
            } catch (error) {
              this.logError("CSRF token ensure failed:", error);
            }
          }

          //fallback
          const cookieStr =
            typeof document !== "undefined" ? document.cookie : "";
          const match = cookieStr
            ?.split("; ")
            .find((row) => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1];

          if (match) {
            const decoded = decodeURIComponent(match);
            // Axios v1 headers can be AxiosHeaders; support both APIs
            // Type guard: config.headers is AxiosHeaders
            if (typeof config.headers.set === "function") {
              config.headers.set("X-XSRF-TOKEN", decoded);
            } else {
              (config.headers as any)["X-XSRF-TOKEN"] = decoded;
            }
          }

          return config;
        }

        return config;
      },
      (error: AxiosError) => {
        this.logError("Request Error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.response) {
          await this.handleResponseError(error);
        } else if (error.request) {
          this.logError(
            "Network Error: No response received",
            this.config.enableDetailedErrors
              ? error.request
              : "Network issue occurred",
          );
        } else {
          this.logError("Request Setup Error:", error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  private async handleResponseError(error: AxiosError): Promise<void> {
    const errorDetails = this.config.enableDetailedErrors
      ? { data: error.response?.data, headers: error.response?.headers }
      : "Enable detailed errors in development environment";

    switch (error.response?.status) {
      case 400:
        this.logError("Bad Request:", errorDetails);
        break;
      case 401: {
        this.logWarning("Unauthorized: Token might be invalid or expired");
        // Only call handleUnauthorized for requests that are NOT excluded endpoints
        const excludedEndpoints = ["/login"];
        if (
          error.config?.url &&
          !excludedEndpoints.some((endpoint) =>
            error.config?.url?.includes(endpoint),
          )
        ) {
          await this.handleUnauthorized();
        }
        break;
      }
      case 402: {
        this.logError("Payment Required:", errorDetails);
        // Optionally, redirect to a payment or subscription page
        this.handleUnSubscribed();
        break;
      }
      case 403:
        this.logWarning("Forbidden: No permission to access this resource");
        break;
      case 404:
        this.logWarning("Not Found: Resource does not exist");
        break;
      case 428:
        this.logWarning(
          "Account Not Verified: Please verify your account to proceed.",
        );
        await this.handleUnVerified();
        break;
      case 500:
        this.logError(
          "Internal Server Error:",
          this.config.enableDetailedErrors
            ? errorDetails
            : "Server error occurred",
        );
        break;
      default:
        this.logError(`Error ${error.response?.status}:`, error.message);
    }
  }

  // Environment-aware logging methods
  private logError(message: string, data?: any): void {
    if (this.config.enableLogging) {
      console.error(`❌ ${message}`, data);
    }
  }

  private logWarning(message: string, data?: any): void {
    if (this.config.enableLogging) {
      console.warn(`⚠️ ${message}`, data);
    }
  }

  private async handleUnauthorized(): Promise<void> {
    console.log(
      "Authentication Error",
      "Your session has expired. Please log in again.",
    );
  }

  private async handleUnSubscribed(): Promise<void> {
    console.log(
      "Subscription Error",
      "Your subscription has expired. Please renew your subscription to continue using our services.",
    );
  }

  private async handleUnVerified(): Promise<void> {
    console.log(
      "Verification Error",
      "Your account is not verified. Please verify your account to continue using our services.",
    );
  }

  // Public getter for environment info
  public getEnvironmentInfo(): EnvironmentConfig {
    return { ...this.config };
  }

  // HTTP methods remain the same
  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch<T>(url, data);
    return response.data;
  }

  /**
   * POST request that returns a Blob response (for binary data like images)
   * Useful for fetching images, PDFs, or other binary files
   */
  public async postBlob(url: string, data?: any): Promise<Blob> {
    const response = await this.api.post(url, data, {
      responseType: "blob",
    });
    return response.data;
  }

  /**
   * POST request for binary data (e.g., PDF files)
   * @param endpoint - API endpoint
   * @param data - Request payload
   * @returns Promise<ArrayBuffer> - Binary response data
   */
  public async postBinary(endpoint: string, data: any): Promise<ArrayBuffer> {
    try {
      const response = await this.api.post(endpoint, data, {
        responseType: "arraybuffer",
      });
      return response.data;
    } catch (error) {
      this.logError(`Binary request failed [${endpoint}]:`, error);
      throw error;
    }
  }
}

export default BaseService.getInstance();
