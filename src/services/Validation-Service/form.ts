import type { RuleFn } from "./rules";

export interface FieldConfig<T = any> {
  rules: RuleFn<T>[];
  value?: T;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export class FormValidator<T extends Record<string, any>> {
  private schema: Record<keyof T, RuleFn[]>;

  constructor(schema: Record<keyof T, RuleFn[]>) {
    this.schema = schema;
  }

  /**
   * Validate a full data object against the schema
   */
  public validate(data: T): ValidationResult {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    for (const key in this.schema) {
      const fieldRules = this.schema[key];
      const value = data[key];
      const fieldErrors: string[] = [];

      for (const rule of fieldRules) {
        const result = rule(value);
        if (result !== true) {
          fieldErrors.push(
            typeof result === "string" ? result : "Invalid value",
          );
          isValid = false;
        }
      }

      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors;
      }
    }

    return { isValid, errors };
  }

  /**
   * Validate a single field
   */
  public validateField(key: keyof T, value: any): string[] {
    const rules = this.schema[key] || [];
    const errors: string[] = [];

    for (const rule of rules) {
      const result = rule(value);
      if (result !== true) {
        errors.push(typeof result === "string" ? result : "Invalid value");
      }
    }

    return errors;
  }
}
