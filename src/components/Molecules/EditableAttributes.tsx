import { Dispatch, SetStateAction, useState } from "react";
import {
  TabAttributeAddButton,
  TabAttributeComponent,
  TabAttributeComponentLabel,
  TabAttributeComponentValue,
  TabAttributeComponentValueLargeText,
  TabAttributeEditMode,
} from "../Atoms/TabLists";
import { TextInput } from "../Atoms/TextInput";
import { TagEnum } from "@prisma/client";
import clsx from "clsx";
import { on } from "events";

export const TabListComponentTextField: React.FC<{
  label: string;
  value: string;
  exists: boolean;
  updateValueFunction: (newValue: string) => void;
  capitalise?: boolean;
}> = ({ label, value, exists, updateValueFunction, capitalise = true }) => {
  const [newValue, setNewValue] = useState(value ?? "");
  return (
    <TabAttributeComponent
      title={label}
      StandardComponent={
        <StandardTextComponent
          label={label}
          value={value}
          capitalise={capitalise}
        />
      }
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

const StandardTextComponent: React.FC<{
  label: string;
  value: string;
  capitalise?: boolean;
}> = ({ label, value, capitalise = true }) => {
  return (
    <>
      <TabAttributeComponentLabel label={label} />
      <TabAttributeComponentValue value={value} capitalise={capitalise} />
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

export const TabListComponentLargeTextField: React.FC<{
  label: string;
  value: string;
  exists: boolean;
  updateValueFunction: (newValue: string) => void;
}> = ({ label, value, exists, updateValueFunction }) => {
  const [newValue, setNewValue] = useState(value ?? "");
  return (
    <TabAttributeComponent
      title={label}
      StandardComponent={
        <StandardLargeTextComponent label={label} value={value} />
      }
      EditableComponent={
        <EditableLargeTextComponent
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

const StandardLargeTextComponent: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <>
      <TabAttributeComponentLabel label={label} />
      <TabAttributeComponentValueLargeText value={value} />
    </>
  );
};

const EditableLargeTextComponent: React.FC<{
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label: string;
}> = ({ value, setValue, label }) => {
  return (
    <>
      <TabAttributeComponentLabel label={label} />

      <textarea
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
        cols={60}
        rows={3}
        className={clsx(
          "border-1 w-full border border-slate-400 p-2 font-extrabold text-slate-900 outline-none",
          { "border border-2 border-red-500": false }
        )}
      ></textarea>
    </>
  );
};

export const TabListComponentTags: React.FC<{
  tag?: string;
  exists: boolean;
  updateTagFunction: (newTag: TagEnum | undefined) => void;
}> = ({ tag, exists, updateTagFunction }) => {
  const initalTag = (tag as TagEnum) ?? undefined;
  const [newTag, setNewTag] = useState<TagEnum | undefined>(initalTag);
  return (
    <TabAttributeComponent
      title={"Tag"}
      StandardComponent={<Tag tag={tag} />}
      EditableComponent={
        <EditableTag selectedTag={newTag} setTag={setNewTag} />
      }
      exists={exists}
      onConfirmEdit={() => {
        updateTagFunction(newTag);
      }}
    />
  );
};

const Tag: React.FC<{ tag?: string }> = ({ tag }) => {
  return (
    <>
      <TabAttributeComponentLabel label="Tag:" />
      <TabAttributeComponentValue value={tag ?? ""} />
    </>
  );
};

const EditableTag: React.FC<{
  selectedTag?: TagEnum;
  setTag: Dispatch<SetStateAction<TagEnum | undefined>>;
}> = ({ selectedTag, setTag }) => {
  const tags = Object.values(TagEnum);
  return (
    <>
      <TabAttributeComponentLabel label="Tag:" />
      <div className=" flex flex-wrap">
        {tags.map((tag, index) =>
          tag.toString() === selectedTag ? (
            <button
              key={index}
              className="m-4 rounded-lg border-2 border-altPrimary bg-brand p-1"
            >
              <span className="text-lg font-medium text-altPrimary">
                {tag}✓
              </span>
            </button>
          ) : (
            <button
              key={index}
              onClick={() => setTag(tag)}
              className="m-4 rounded-lg border-2 border-dark p-1 text-lg font-medium text-dark"
            >
              {tag}
            </button>
          )
        )}
      </div>
    </>
  );
};

export const TabListComponentAddField: React.FC<{
  onClick: (sectionName: string) => void;
  label: string;
}> = ({ onClick, label }) => {
  const [inputMode, setInputMode] = useState(false);
  const [sectionName, setSectionName] = useState("");

  if (!inputMode)
    return (
      <TabAttributeAddButton onClick={() => setInputMode(true)} title={label} />
    );

  return (
    <div className="flex ">
      <TabAttributeEditMode
        EditableComponent={
          <EditableTextComponent
            value={sectionName}
            setValue={setSectionName}
            label="Section Name"
          />
        }
        onClickCancel={() => setInputMode(false)}
        onClickConfirm={() => {
          onClick(sectionName);
          setInputMode(false);
        }}
      />
    </div>
  );
};

export const TabListComponentAddDocument: React.FC<{
  onClick: (documentName: string) => void;
}> = ({ onClick }) => {
  const [inputMode, setInputMode] = useState(false);
  const [documentName, setDocumentName] = useState("");

  if (!inputMode)
    return (
      <TabAttributeAddButton
        onClick={() => setInputMode(true)}
        title="Document"
      />
    );

  return (
    <div className="flex ">
      <TabAttributeEditMode
        EditableComponent={
          <EditableTextComponent
            value={documentName}
            setValue={setDocumentName}
            label="Document Name"
          />
        }
        onClickCancel={() => setInputMode(false)}
        onClickConfirm={() => {
          onClick(documentName);
          setInputMode(false);
        }}
      />
    </div>
  );
};
