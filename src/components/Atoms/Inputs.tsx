import clsx from "clsx";
import { ErrorMessage } from "./Text";
import ClickAwayListener from "../ClickAwayListener";

export function TextInputWithError({
  label,
  value,
  onChange,
  error,
  errorMessage,
  type,
  onClickAway,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorMessage: string | null;
  type: string;
  onClickAway: () => void;
}) {
  return (
    <ClickAwayListener clickOutsideAction={onClickAway}>
      <div className="flex flex-col">
        <label className="text-slate-700">{label}</label>
        <input
          className={clsx(
            "rounded-lg border-2 border-slate-200 p-2",
            error ? "border-red-500" : "border-slate-200"
          )}
          value={value}
          onChange={onChange}
          type={type}
        />
        <ErrorMessage error={error} errorMessage={errorMessage} />
      </div>
    </ClickAwayListener>
  );
}
