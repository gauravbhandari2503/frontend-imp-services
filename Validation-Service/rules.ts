// All rules return true or a string (error message) to plug directly into v-text-field `rules` prop

export type RuleFn<T = any> = (value: T) => true | string;

const isEmpty = (v: unknown) =>
  v === null ||
  v === undefined ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

export const required =
  (msg = "This field is required"): RuleFn =>
  (value) => {
    return !isEmpty(value) || msg;
  };

export const email =
  (msg = "Please enter a valid email"): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true; // allow empty unless required is also used
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()) || msg;
  };

// At least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
export const password =
  (
    msg = "Password must be at least 6 characters long and include uppercase, lowercase, numbers and a special character",
  ): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true;
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[^\s]{6,}$/;
    return re.test(String(value).trim()) || msg;
  };

// check for leading or trailing spaces
export const noLeadingTrailingSpaces =
  (msg = "No leading or trailing spaces allowed"): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true;
    const str = String(value);
    return str === str.trim() || msg;
  };

// international phone (10+ digits)
export const phone =
  (msg = "Please enter a valid phone number"): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true;
    return /^\d{10,15}$/.test(String(value).trim()) || msg;
  };

// Builders for custom needs
export const minLength =
  (len: number, msg?: string): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true;
    return (
      String(value).length >= len || msg || `Must be at least ${len} characters`
    );
  };

export const maxLength =
  (len: number, msg?: string): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true;
    return (
      String(value).length <= len || msg || `Must be at most ${len} characters`
    );
  };

export const pattern =
  (re: RegExp, msg = "Invalid value"): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true;
    return re.test(String(value)) || msg;
  };

export const equals =
  (
    other: () => string | number | boolean | null | undefined,
    msg = "Values do not match",
  ): RuleFn<any> =>
  (value) => {
    return value === other() || msg;
  };

export const notEquals =
  (
    other: () => string | number | boolean | null | undefined,
    msg = "Values must not match",
  ): RuleFn<any> =>
  (value) => {
    return value !== other() || msg;
  };

// File-specific validation rules
export const fileSize =
  (maxBytes: number, msg?: string): RuleFn<File> =>
  (file) => {
    if (!file) return true;
    const maxMB = Math.round((maxBytes / (1024 * 1024)) * 10) / 10;
    return (
      file.size <= maxBytes || msg || `File size must be less than ${maxMB}MB`
    );
  };

export const minFileSize =
  (minBytes: number, msg?: string): RuleFn<File> =>
  (file) => {
    if (!file) return true;
    const minMB = Math.round((minBytes / (1024 * 1024)) * 10) / 10;
    return (
      file.size >= minBytes || msg || `File size must be at least ${minMB}MB`
    );
  };

export const fileType =
  (allowedTypes: string[], msg?: string): RuleFn<File> =>
  (file) => {
    if (!file) return true;
    return (
      allowedTypes.includes(file.type) ||
      msg ||
      `File type ${file.type} is not allowed`
    );
  };

export const fileExtension =
  (allowedExtensions: string[], msg?: string): RuleFn<File> =>
  (file) => {
    if (!file) return true;
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    const allowedExtsLower = allowedExtensions.map((ext) => ext.toLowerCase());
    return (
      allowedExtsLower.includes(fileExt) ||
      msg ||
      `File extension ${fileExt} is not allowed`
    );
  };

export const imageFile =
  (msg = "Please select a valid image file"): RuleFn<File> =>
  (file) => {
    if (!file) return true;
    return file.type.startsWith("image/") || msg;
  };

export const pdfFile =
  (msg = "Please select a valid PDF file"): RuleFn<File> =>
  (file) => {
    if (!file) return true;
    return file.type === "application/pdf" || msg;
  };

// Helper to combine multiple rules into one rule function (short-circuits on first error)
export const composeRules =
  (...rules: RuleFn[]): RuleFn =>
  (value) => {
    for (const rule of rules) {
      const res = rule(value);
      if (res !== true) return res;
    }
    return true;
  };

export const numericValue =
  (msg = "Please enter a valid number"): RuleFn<string> =>
  (value) => {
    if (isEmpty(value)) return true;
    const numberRegex = /^\d*$/;
    return numberRegex.test(String(value)) || msg;
  };

// Date range validation rules
export const dateRange =
  (
    _msg = "Please select a valid date range",
  ): RuleFn<{ from: string | null; to: string | null }> =>
  (value) => {
    if (!value || (isEmpty(value.from) && isEmpty(value.to))) return true;

    // If only one date is selected, both should be selected
    if ((value.from && !value.to) || (!value.from && value.to)) {
      return "Please select both from and to dates";
    }

    // If both dates are selected, validate the range
    if (value.from && value.to) {
      const fromDate = new Date(value.from);
      const toDate = new Date(value.to);

      if (fromDate >= toDate) {
        return "From date must be before to date";
      }
    }

    return true;
  };

export const dateRangeRequired =
  (
    msg = "Date range is required",
  ): RuleFn<{ from: string | null; to: string | null }> =>
  (value) => {
    if (!value || isEmpty(value.from) || isEmpty(value.to)) {
      return msg;
    }
    return true;
  };

export const maxDateRange =
  (
    maxDays: number,
    msg?: string,
  ): RuleFn<{ from: string | null; to: string | null }> =>
  (value) => {
    if (!value || isEmpty(value.from) || isEmpty(value.to)) return true;

    const fromDate = new Date(value.from as string);
    const toDate = new Date(value.to as string);
    const diffTime = toDate.getTime() - fromDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
      diffDays <= maxDays || msg || `Date range cannot exceed ${maxDays} days`
    );
  };

export const positiveNumber =
  (msg = "Please enter a positive number"): RuleFn<string | number> =>
  (value) => {
    if (isEmpty(value)) return true;
    const num =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/,/g, ""));
    return (!isNaN(num) && num > 0) || msg;
  };

export const nonNegativeNumber =
  (msg = "Please enter a non-negative number"): RuleFn<string | number> =>
  (value) => {
    if (isEmpty(value)) return true;
    const num =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/,/g, ""));
    return (!isNaN(num) && num >= 0) || msg;
  };

export const integerValue =
  (msg = "Please enter a whole number"): RuleFn<string | number> =>
  (value) => {
    if (isEmpty(value)) return true;
    const num =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/,/g, ""));
    return (!isNaN(num) && Number.isInteger(num)) || msg;
  };

export const minValue =
  (min: number, msg?: string): RuleFn<string | number> =>
  (value) => {
    if (isEmpty(value)) return true;
    const num =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/,/g, ""));
    return (
      (!isNaN(num) && num >= min) || msg || `Value must be at least ${min}`
    );
  };

export const maxValue =
  (max: number, msg?: string): RuleFn<string | number> =>
  (value) => {
    if (isEmpty(value)) return true;
    const num =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/,/g, ""));
    return (!isNaN(num) && num <= max) || msg || `Value must be at most ${max}`;
  };

export const halfStepNumber =
  (msg = "Please enter a number in 0.5 increments"): RuleFn<string | number> =>
  (value) => {
    if (isEmpty(value)) return true;
    const num =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/,/g, ""));
    return (!isNaN(num) && (num * 2) % 1 === 0) || msg;
  };

export const isNumber =
  (msg = "Please enter a valid number"): RuleFn<string | number> =>
  (value) => {
    if (isEmpty(value)) return true;
    const num =
      typeof value === "number"
        ? value
        : parseFloat(String(value).replace(/,/g, ""));
    return !isNaN(num) || msg;
  };

export const Rules = {
  required,
  email,
  password,
  noLeadingTrailingSpaces,
  phone,
  minLength,
  maxLength,
  pattern,
  equals,
  composeRules,
  numericValue,
  dateRange,
  dateRangeRequired,
  maxDateRange,
  positiveNumber,
  nonNegativeNumber,
  integerValue,
  minValue,
  maxValue,
  halfStepNumber,
  isNumber,
  fileSize,
  minFileSize,
  fileType,
  fileExtension,
  imageFile,
  pdfFile,
};

export type { RuleFn as ValidationRuleFn };
