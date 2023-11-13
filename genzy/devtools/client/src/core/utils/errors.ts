function extractErrorMessage(error: any) {
  if ("length" in error) {
    return "Bad request, data does not match the expected schema.";
  }
  return error?.message;
}

export { extractErrorMessage };
