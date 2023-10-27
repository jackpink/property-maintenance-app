type TextInputWithErrorProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorMessage: string;
  disabled?: boolean;
};

const TextInputWithError: React.FC<TextInputWithErrorProps> = ({
  label,
  value,
  onChange,
  error,
  errorMessage,
  disabled,
}) => {
  return (
    <>
      {" "}
      <label className="text-lg text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e)}
        disabled={disabled}
        className={clsx(
          "mb-4 rounded-md bg-gray-100 p-2 ",
          {
            " border border-4 border-red-500 ": error,
          },
          { "border border-2 border-slate-500": !error }
        )}
      />
      {error ? <p className="text-red-500">⚠️ {errorMessage}</p> : null}
    </>
  );
};
