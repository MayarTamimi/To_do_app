import { useState, useEffect } from "react";

const defaultPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const defaultMessage =
  "Password must be 8–50 characters with at least one letter and one number.";

export function usePasswordValidation({
  password = "",
  pattern = defaultPattern,
  message = defaultMessage,
}) {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (password === "") {
      setIsValid(false);
      setError("");
    } else if (pattern.test(password)) {
      setIsValid(true);
      setError("");
    } else {
      setIsValid(false);
      setError(message);
    }
  }, [password, pattern, message]);

  return { isValid, error };
}
