export default function isPending(formState) {
  if (!formState) return false;

  // FField is pending
  if (!formState.$form) {
    return formState.pending;
  }

  // Any field in form is pending
  return Object.keys(formState).some((key) => isPending(formState[key]));
}
