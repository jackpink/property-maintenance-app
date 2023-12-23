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
  EditableComponent,
  StandardComponent,
  exists,
}: {
  EditableComponent: ReactNode;
  StandardComponent: ReactNode;
  exists: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <>
      {!exists ? (
        <>Add BUtton</>
      ) : editMode ? (
        <div className="flex">
          {EditableComponent}
          <button onClick={() => setEditMode(false)}>Close</button>
        </div>
      ) : (
        <div className="flex">
          {StandardComponent}
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
    </>
  );
};
