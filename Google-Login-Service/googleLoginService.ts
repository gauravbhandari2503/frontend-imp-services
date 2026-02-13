import { envConfigService } from "../Environment-Config-Service/environmentConfigService";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (moment?: any) => void;
        };
      };
    };
  }
}

export interface GoogleLoginConfig {
  callback: (response: any) => void;
  autoSelect?: boolean;
  clientId?: string;
}

export interface GoogleButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: string;
  locale?: string;
}

export class GoogleLoginService {
  private static instance: GoogleLoginService;
  private isScriptLoaded = false;
  private scriptUrl = "https://accounts.google.com/gsi/client";
  private clientId: string | undefined;

  private constructor() {}

  public static getInstance(): GoogleLoginService {
    if (!GoogleLoginService.instance) {
      GoogleLoginService.instance = new GoogleLoginService();
    }
    return GoogleLoginService.instance;
  }

  /**
   * Initialize Google Login
   * @param config Configuration options
   */
  public init(config: GoogleLoginConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clientId = config.clientId || envConfigService.get("googleClientId");
      if (!this.clientId) {
        reject(new Error("Google Client ID is not configured."));
        return;
      }

      this.loadScript()
        .then(() => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: this.clientId!,
              callback: config.callback,
              auto_select: config.autoSelect || false,
            });
            resolve();
          } else {
            reject(
              new Error(
                "Google Identity Services script failed to load correctly.",
              ),
            );
          }
        })
        .catch(reject);
    });
  }

  /**
   * Render the Google Sign-In button
   * @param containerId ID of the HTML element to render the button in
   * @param options Button customization options
   */
  public renderButton(
    containerId: string,
    options: GoogleButtonOptions = {},
  ): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(
        `GoogleLoginService: Container element '#${containerId}' not found.`,
      );
      return;
    }

    if (window.google) {
      window.google.accounts.id.renderButton(container, {
        type: "standard",
        theme: "outline",
        size: "large",
        ...options,
      });
    } else {
      console.error(
        "GoogleLoginService: Google SDK not initialized. Call init() first.",
      );
    }
  }

  /**
   * Load the Google Identity Services script
   */
  private loadScript(): Promise<void> {
    if (this.isScriptLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = this.scriptUrl;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => {
        reject(new Error(`Failed to load Google script: ${error}`));
      };
      document.head.appendChild(script);
    });
  }
}

export const googleLoginService = GoogleLoginService.getInstance();
