import clsx from "clsx";
import Link from "next/link";
import { ReactNode, useState } from "react";

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
  StandardComponent,
  exists,
}: {
  title: string;
  EditableComponent: ReactNode;
  StandardComponent: ReactNode;
  exists: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="flex py-10">
      {editMode ? (
        <>
          {EditableComponent}
          <button onClick={() => setEditMode(false)}>Close</button>
        </>
      ) : !exists ? (
        <button
          className="text-lg text-brandSecondary"
          onClick={() => setEditMode(true)}
        >
          + Add {title}
        </button>
      ) : (
        <>
          {StandardComponent}
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
    </div>
  );
};
