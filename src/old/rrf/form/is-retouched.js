export default function isRetouched(formState) {
  if (!formState) return false;

  // FField is pending
  if (!formState.$form) {
    return formState.retouched;
  }

  // Any field in form is pending
  return Object.keys(formState).some((key) => isRetouched(formState[key]));
}
