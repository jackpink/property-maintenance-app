import clsx from "clsx";
import { ErrorMessage } from "./Atoms/Text";

type TextInputWithErrorProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorMessage: string;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "tel";
};

const TextInputWithError: React.FC<TextInputWithErrorProps> = ({
  label,
  value,
  onChange,
  error,
  errorMessage,
  disabled,
  type = "text",
}) => {
  return (
    <>
      <TextInput
        label={label}
        value={value}
        error={error}
        onChange={onChange}
        disabled={disabled}
        type={type}
      />
      <ErrorMessage error={error} errorMessage={errorMessage} />
    </>
  );
};

type TextInputProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "tel";
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  error,
  onChange,
  disabled,
  type = "text",
}) => {
  // types are numeric, text, date, email, password, tel, url, search, color, datetime-local, month, number, range, time, week
  // inputmodes are none, text, decimal, numeric, tel, search, email, url
  // autocomplete is
  let inputMode: "text" | "email" | "tel" = "text";
  let autoComplete = "off";
  switch (type) {
    case "email":
      inputMode = "email";
      autoComplete = "email";
      break;
    case "password":
      inputMode = "text";
      autoComplete = "current-password";
      break;
    case "tel":
      inputMode = "tel";
      autoComplete = "tel";
      break;
  }
  return (
    <>
      {" "}
      {label && <label className="text-lg text-slate-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e)}
        disabled={disabled}
        className={clsx(
          " w-full rounded-md bg-gray-100 p-2 ",
          {
            " border border-4 border-red-500 ": error,
          },
          { "border border-2 border-slate-400": !error }
        )}
        inputMode={inputMode}
        autoComplete={autoComplete}
      />
    </>
  );
};

export { TextInput, TextInputWithError };
