// Simple form validation composable-free helper for forms
// Goal: keep v-text-field usage unchanged (use `:rules="[...]"`) and offer
// a reactive way to enable/disable submit buttons when all fields are valid.

import { computed, isRef, type Ref } from "vue";

// Each field exposes: value ref and its rules (array of functions returning true|string)
export type Rule<T = any> = (value: T) => true | string;

export type FieldValueSrc<T = any> = Ref<T> | (() => T) | T;

export interface FieldHandle<T = any> {
  value: FieldValueSrc<T>;
  rules: Rule<T>[];
  // Optional external invalid flag (e.g., server-side error)
  externallyInvalid?: Ref<boolean>;
}

// Normalize value source and touch deps for reactivity
function readCurrent<T>(src: FieldValueSrc<T>): T {
  if (isRef(src)) return src.value as T;
  if (typeof src === "function") return (src as () => T)();
  return src as T;
}

// Create a form validator instance
// Usage:
// const formA = createFormValidator({
//   email: { value: emailRef, rules: [required(), email()] },
//   password: { value: passwordRef, rules: [required(), password()] }
// });
// <v-btn :disabled="!formA.isValid">Submit A</v-btn>
export interface FormValidationInstance {
  validate: () => boolean;
  isValid: Readonly<Ref<boolean>>;
  anyDirty: Readonly<Ref<boolean>>;
  resetValidation: () => void;
}

export function createFormValidator(
  fields: Record<string, FieldHandle>,
): FormValidationInstance {
  const fieldEntries = Object.entries(fields);

  const computeFieldValid = (fh: FieldHandle): boolean => {
    const val = readCurrent(fh.value);
    for (const rule of fh.rules || []) {
      const res = rule(val);
      if (res !== true) return false;
    }
    if (fh.externallyInvalid?.value) return false;
    return true;
  };

  const isValid = computed(() => {
    if (fieldEntries.length === 0) return false;
    let okAll = true;
    for (const [, fh] of fieldEntries) {
      // touch deps
      readCurrent(fh.value);
      const _ext = fh.externallyInvalid?.value; // eslint-disable-line @typescript-eslint/no-unused-vars
      if (!computeFieldValid(fh)) okAll = false;
    }
    return okAll;
  });

  const anyDirty = computed(() => {
    let dirty = false;
    for (const [, fh] of fieldEntries) {
      const v = readCurrent(fh.value);
      const nonEmpty = Array.isArray(v)
        ? v.length > 0
        : v !== undefined && v !== null && String(v).trim() !== "";
      if (nonEmpty) dirty = true;
    }
    return dirty;
  });

  const validate = () => isValid.value;

  const resetValidation = () => {
    for (const [, fh] of fieldEntries) {
      if (fh.externallyInvalid) {
        fh.externallyInvalid.value = false;
      }
    }
  };

  return { validate, isValid, anyDirty, resetValidation };
}
