import { envConfigService } from "../Environment-Config-Service/environmentConfigService";

// --- Google Identity Services Types ---

export interface CredentialResponse {
  credential: string;
  select_by?:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "btn_add_session"
    | "btn_confirm_add_session";
  clientId?: string;
}

interface IdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  login_uri?: string;
  native_callback?: Function;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: "signin" | "signup" | "use";
  state?: string;
  referrerPolicy?: ReferrerPolicy;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  logo_alignment?: "left" | "center";
}

export interface GsiButtonConfiguration {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number | string;
  locale?: string;
}

interface GoogleAccountsId {
  initialize: (config: IdConfiguration) => void;
  renderButton: (
    parent: HTMLElement,
    options: GsiButtonConfiguration,
    clickHandler?: any,
  ) => void;
  prompt: (notification?: (notification: any) => void) => void;
  disableAutoSelect: () => void;
  storeCredential: (credential: any, callback?: any) => void;
  cancel: () => void;
  revoke: (hint: string, done: (response: any) => void) => void;
}

interface GoogleGlobal {
  accounts: {
    id: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    google?: GoogleGlobal;
  }
}

// --------------------------------------

export class GoogleLoginService {
  private static instance: GoogleLoginService;
  private isInitialized = false;
  private isScriptLoaded = false;
  private readonly scriptUrl = "https://accounts.google.com/gsi/client";
  private clientId: string;

  private constructor() {
    this.clientId = envConfigService.get("googleClientId") || "";
  }

  public static getInstance(): GoogleLoginService {
    if (!GoogleLoginService.instance) {
      GoogleLoginService.instance = new GoogleLoginService();
    }
    return GoogleLoginService.instance;
  }

  /**
   * Initialize Google Accounts SDK
   * Loads the script if not already loaded.
   */
  public async initialize(
    callback: (response: CredentialResponse) => void,
    autoSelect: boolean = false,
  ): Promise<void> {
    if (!this.clientId) {
      console.warn("Google Client ID is missing. Google Login will not work.");
      return;
    }

    try {
      await this.loadScript();

      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: callback,
          auto_select: autoSelect,
          cancel_on_tap_outside: false,
        });
        this.isInitialized = true;
      } else {
        console.error(
          "Google Identity Services loaded but 'google.accounts.id' is missing.",
        );
      }
    } catch (error) {
      console.error("Failed to load Google Identity Services script:", error);
    }
  }

  /**
   * Render the Google Sign-In button
   */
  public renderButton(
    element: HTMLElement,
    options: GsiButtonConfiguration = {},
  ): void {
    if (!this.isInitialized) {
      console.error(
        "Google Login Service not initialized. Call initialize() first.",
      );
      return;
    }

    // Defaults
    const buttonOptions: GsiButtonConfiguration = {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
      ...options,
    };

    window.google?.accounts.id.renderButton(element, buttonOptions);
  }

  /**
   * Prompt the One Tap dialog
   */
  public prompt(): void {
    if (!this.isInitialized) {
      console.warn("Google Login Service not initialized cannot prompt.");
      return;
    }
    window.google?.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.debug(
          "One Tap skipped/not displayed:",
          notification.getSkippedReason(),
        );
      }
    });
  }

  /**
   * Load the Google Identity Services script dynamically
   */
  private loadScript(): Promise<void> {
    if (this.isScriptLoaded || (window.google && window.google.accounts)) {
      this.isScriptLoaded = true;
      return Promise.resolve();
    }

    // Check if script tag already exists
    if (document.querySelector(`script[src="${this.scriptUrl}"]`)) {
      this.isScriptLoaded = true;
      return Promise.resolve();
      // Note: Ideally we'd wait for onload of existing script, but simpler for now
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
