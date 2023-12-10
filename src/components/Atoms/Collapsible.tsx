import clsx from "clsx";
import { ExpandButton } from "./Button";
import { Text } from "./Text";

export const Collapsible: React.FC<
  React.PropsWithChildren<{ open: boolean }>
> = ({ children, open }) => {
  return (
    <div
      className={clsx(
        open ? "visible max-h-full" : "invisible max-h-0",
        "transition-all duration-300"
      )}
    >
      {children}
    </div>
  );
};

export const CollapsibleHeader: React.FC<
  React.PropsWithChildren<{ onClick: () => void }>
> = ({ children, onClick }) => {
  return (
    <button className="w-full" onClick={onClick}>
      {children}
    </button>
  );
};

export const CollapsibleFilterHeader: React.FC<{
  onClick: () => void;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
}> = ({ onClick, selected, setSelected, open, setOpen, label }) => {
  return (
    <div className="flex px-4 py-2">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => setSelected(e.currentTarget.checked)}
        className="h-8 w-8"
      />

      <button className="flex w-full" onClick={onClick}>
        <Text className="grow pl-4">{label}</Text>

        <ExpandButton isOpen={open} setIsOpen={setOpen} />
      </button>
    </div>
  );
};
