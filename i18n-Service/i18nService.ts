export type Locale = string;
export type Translations = Record<string, any>;

export class I18nService {
  private static instance: I18nService;
  private currentLocale: Locale = "en";
  private translations: Record<Locale, Translations> = {};
  private isInitialized = false;
  private fallbackLocale: Locale = "en";

  private constructor() {}

  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  /**
   * Initialize the service.
   * @param defaultLocale The default language to start with.
   */
  public async init(defaultLocale: Locale = "en"): Promise<void> {
    if (this.isInitialized) return;

    this.currentLocale = defaultLocale;
    await this.loadLocale(defaultLocale);

    if (defaultLocale !== this.fallbackLocale) {
      // Optimistically load fallback just in case
      this.loadLocale(this.fallbackLocale).catch(console.error);
    }

    this.isInitialized = true;
  }

  /**
   * Change the current language.
   * Fetches the file if not already loaded.
   */
  public async setLocale(locale: Locale): Promise<void> {
    if (this.currentLocale === locale) return;

    if (!this.translations[locale]) {
      await this.loadLocale(locale);
    }
    this.currentLocale = locale;

    // Persist preference if needed (e.g. localStorage)
    // localStorage.setItem('user-locale', locale);
  }

  public getLocale(): Locale {
    return this.currentLocale;
  }

  /**
   * Translate a key with optional dynamic parameters.
   * Supports nested keys via dot notation: 'common.welcome'
   * @param key The translation key
   * @param params Object containing values to replace {name: 'John'}
   */
  public t(key: string, params?: Record<string, string | number>): string {
    const translation = this.getValue(
      key,
      this.translations[this.currentLocale],
    );

    if (translation === undefined) {
      // Try fallback
      const fallback = this.getValue(
        key,
        this.translations[this.fallbackLocale],
      );
      if (fallback !== undefined) {
        return this.interpolate(fallback, params);
      }
      console.warn(`[i18n] Missing translation for key: ${key}`);
      return key;
    }

    return this.interpolate(translation, params);
  }

  /**
   * Helper to retrieve nested values
   */
  private getValue(key: string, data: Translations): string | undefined {
    if (!data) return undefined;
    return key.split(".").reduce((obj, i) => obj?.[i], data);
  }

  /**
   * Interpolate values into the string.
   * "Hello {name}" + {name: "John"} => "Hello John"
   */
  private interpolate(
    text: string,
    params?: Record<string, string | number>,
  ): string {
    if (!params) return text;

    return text.replace(/{(\w+)}/g, (match, paramName) => {
      const value = params[paramName];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Load a locale file.
   * You might need to adjust the import path pattern for your bundler (Vite/Webpack).
   */
  private async loadLocale(locale: Locale): Promise<void> {
    try {
      // Vite glob import or dynamic import
      // Note: Dynamic imports with variables often require a specific structure for bundlers to analyze
      const messages = await import(`./locales/${locale}.json`);
      this.translations[locale] = messages.default || messages;
    } catch (error) {
      console.error(`[i18n] Failed to load locale: ${locale}`, error);
      throw error;
    }
  }
}

export const i18nService = I18nService.getInstance();
