import axios from "axios";
class CsrfService {
  private static instance: CsrfService;
  private tokenFetched = false;
  private fetchPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): CsrfService {
    if (!CsrfService.instance) {
      CsrfService.instance = new CsrfService();
    }
    return CsrfService.instance;
  }

  /**
   * Ensure a valid CSRF token is available.
   * @returns A promise that resolves when the token is ready.
   */
  public async ensureToken(): Promise<void> {
    // If already fetching, return the same promise
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    if (this.hasValidToken()) {
      return Promise.resolve();
    }

    this.fetchPromise = this.fetchToken();

    try {
      await this.fetchPromise;
    } finally {
      this.fetchPromise = null;
    }
  }

  /**
   * Check if the CSRF token is valid.
   * @returns True if the token is valid, false otherwise.
   */
  private hasValidToken(): boolean {
    const xsrfCookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("XSRF-TOKEN="));

    return !!xsrfCookie && this.tokenFetched;
  }

  /**
   * Fetch a new CSRF token from the server.
   * @returns A promise that resolves when the token is fetched.
   */
  private async fetchToken(): Promise<void> {
    const csrfUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}/sanctum/csrf-cookie`;

    try {
      await axios.get(csrfUrl, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      //set timeout to allow cookie to be set
      await new Promise((resolve) => setTimeout(resolve, 100));

      this.tokenFetched = true;

      // Verify token was set
      if (!this.hasValidToken()) {
        throw new Error("CSRF cookie was not set by server");
      }
    } catch (error) {
      this.tokenFetched = false;
      console.error("❌ CSRF token fetch failed:", error);
      throw error;
    }
  }

  /**
   * Reset the CSRF token state.
   */
  public resetToken(): void {
    this.tokenFetched = false;
    this.fetchPromise = null;
  }
}

export default CsrfService.getInstance();
