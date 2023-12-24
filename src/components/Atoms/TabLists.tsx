import clsx from "clsx";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { CancelIcon, ConfirmIcon, EditIconSmall, PlusIcon } from "./Icons";

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
}: {
  title: string;
  EditableComponent: ReactNode;
  onConfirmEdit: () => void;
  StandardComponent: ReactNode;
  exists: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);

  const onClickConfirmButton = () => {
    setEditMode(false);
    onConfirmEdit();
  };

  return (
    <div className="flex w-full justify-between py-10 pl-6">
      {editMode ? (
        <>
          <div>{EditableComponent}</div>
          <div>
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
