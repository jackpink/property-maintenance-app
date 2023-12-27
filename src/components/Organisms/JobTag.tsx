import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";

import {
  TabAttributeComponent,
  TabAttributeComponentLabel,
  TabAttributeComponentValue,
} from "../Atoms/TabLists";
import { TextInput } from "../Atoms/TextInput";
import { TagEnum } from "@prisma/client";

type JobDateProps = {
  tag?: string;
  jobId: string;
  disabled?: boolean;
};

export default function JobTag({ tag, jobId, disabled = false }: JobDateProps) {
  const initalTag = (tag as TagEnum) ?? undefined;
  const [newTag, setNewTag] = useState<TagEnum | undefined>(initalTag);
  const ctx = api.useContext();

  const { mutate: updateJob } = api.job.updateJob.useMutation({
    onSuccess: () => {
      // Refetch job for page
      void ctx.job.getJob.invalidate();
      // close popover
    },
    onError: () => {
      toast("Failed to update Trade information for Job");
    },
  });

  return (
    <>
      <TabAttributeComponent
        title="Tag"
        StandardComponent={<Tag tag={tag} />}
        EditableComponent={
          <EditableTag selectedTag={newTag} setTag={setNewTag} />
        }
        exists={tag ? true : false}
        onConfirmEdit={() => {
          console.log("newTag", newTag?.toString());
          updateJob({ jobId: jobId, tag: newTag });
        }}
      />
    </>
  );
}

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
