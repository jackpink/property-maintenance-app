import clsx from "clsx";
import Link from "next/link";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { CancelIcon, ConfirmIcon, EditIconSmall, PlusIcon } from "./Icons";
import { TextSpan } from "./Text";
import { TextInput } from "./TextInput";

export const TabListComponent = ({
  title,
  href,
  selected,
}: {
  title: string;
  href: string;
  selected: boolean;
}) => {
  return (
    <Link href={href}>
      <p
        className={clsx(
          "rounded-lg border pl-10 text-2xl hover:bg-altSecondary",
          selected && "bg-altSecondary text-altPrimary",
          !selected && "text-dark"
        )}
      >
        {title}
      </p>
    </Link>
  );
};

export const TabAttributeComponent = ({
  title,
  EditableComponent,
  onConfirmEdit,
  StandardComponent,
  exists,
  editable = true,
}: {
  title: string;
  EditableComponent: ReactNode;
  onConfirmEdit: () => void;
  StandardComponent: ReactNode;
  exists: boolean;
  editable?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);

  const onClickConfirmButton = () => {
    setEditMode(false);
    onConfirmEdit();
  };

  return (
    <div className="flex w-full justify-between py-5 pl-6">
      {editMode ? (
        <>
          <div>{EditableComponent}</div>
          <div className="flex flex-nowrap">
            <button onClick={() => setEditMode(false)}>
              <CancelIcon />
            </button>
            <button onClick={onClickConfirmButton}>
              <ConfirmIcon />
            </button>
          </div>
        </>
      ) : !exists ? (
        <button
          className="text-xl text-brandSecondary"
          onClick={() => setEditMode(true)}
        >
          <div className="flex items-center justify-center">
            <PlusIcon width={25} height={25} colour="#c470e7" />
            <span className="pl-4">Add {title}</span>
          </div>
        </button>
      ) : !editable ? (
        <>
          <div>{StandardComponent}</div>
          <div className="justify-self-end"></div>
        </>
      ) : (
        <>
          <div>{StandardComponent}</div>
          <div className="justify-self-end">
            <button onClick={() => setEditMode(true)}>
              <EditIconSmall />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const TabAttributeComponentLabel = ({ label }: { label: string }) => {
  return <TextSpan className="text-xl font-medium">{label}</TextSpan>;
};

export const TabAttributeComponentValue = ({ value }: { value: string }) => {
  return (
    <>
      <TextSpan className="pl-10 text-xl font-normal">
        {value.charAt(0).toUpperCase()}
      </TextSpan>
      <TextSpan className=" text-xl font-normal">{value.slice(1)}</TextSpan>
    </>
  );
};

export const TabListComponentTextField: React.FC<{
  label: string;
  value: string;
  exists: boolean;
  updateValueFunction: (newValue: string) => void;
}> = ({ label, value, exists, updateValueFunction }) => {
  const [newValue, setNewValue] = useState(value ?? "");
  return (
    <TabAttributeComponent
      title={label}
      StandardComponent={<StandardTextComponent label={label} value={value} />}
      EditableComponent={
        <EditableTextComponent
          value={newValue}
          setValue={setNewValue}
          label={label}
        />
      }
      exists={exists}
      onConfirmEdit={() => {
        updateValueFunction(newValue);
      }}
    />
  );
};

const StandardTextComponent: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <>
      <TabAttributeComponentLabel label={label} />
      <TabAttributeComponentValue value={value} />
    </>
  );
};

const EditableTextComponent: React.FC<{
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label: string;
}> = ({ value, setValue, label }) => {
  return (
    <>
      <TabAttributeComponentLabel label={label} />
      <TextInput
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        error={false}
      />
    </>
  );
};
