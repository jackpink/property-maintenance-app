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
import { TabListComponentTags } from "../Molecules/EditableAttributes";

type JobDateProps = {
  tag?: string;
  jobId: string;
  disabled?: boolean;
};

export default function JobTag({ tag, jobId, disabled = false }: JobDateProps) {
  const initalTag = (tag as TagEnum) ?? undefined;

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
      <TabListComponentTags
        tag={tag}
        exists={tag ? true : false}
        updateTagFunction={(newTag) => updateJob({ jobId: jobId, tag: newTag })}
      />
    </>
  );
}
