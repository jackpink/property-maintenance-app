import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import EditDatePopover from "../Molecules/EditDatePopover";
import { CTAButton } from "../Atoms/Button";
import { format } from "date-fns";
import { PageSubTitle } from "../Atoms/Title";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
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
  const [jobDayPickerOpen, setJobDayPickerOpen] = useState(false);
  const [newTag, setNewTag] = useState<TagEnum>();
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
      {tags.map((tag, index) =>
        tag.toString() === selectedTag ? (
          <button key={index} className="selected">
            {tag} <span className="checkmark">✓</span>
          </button>
        ) : (
          <button key={index} onClick={() => setTag(tag)}>
            {tag}
          </button>
        )
      )}
    </>
  );
};
