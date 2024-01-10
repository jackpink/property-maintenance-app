import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import JobDate from "~/components/Organisms/JobTitleAndDate";
import React from "react";
import { PageTitle } from "~/components/Atoms/Title";
import JobCompletedBy from "~/components/Organisms/JobCompletedBy";
import JobDocuments from "~/components/Organisms/JobDocuments";
import JobNotes from "~/components/Organisms/JobNotes";
import JobPhotos from "~/components/Organisms/JobPhotos";
import JobProperty from "~/components/Organisms/JobProperty";
import LoadingSpinner from "~/components/Atoms/LoadingSpinner";
import { useAuth } from "@clerk/nextjs";
import {
  ColumnOne,
  ColumnTwo,
  PageWithMainMenu,
  ResponsiveColumns,
} from "~/components/Atoms/PageLayout";
import { NoteHistory } from "~/components/Molecules/NotesHistory";
import Properties from "~/components/Molecules/Properties";
import {
  JobBreadcrumbs,
  PropertiesBreadcrumbs,
  RoomBreadcrumbs,
} from "~/components/Molecules/Breadcrumbs";
import { concatAddress } from "~/utils/utits";
import { JobPageNav, RoomPageNav } from "~/components/Molecules/PageNav";
import { TabListComponent } from "~/components/Atoms/TabLists";
import JobTag from "~/components/Organisms/JobTag";
import { Room } from "@prisma/client";
import RoomOverview from "~/components/Organisms/RoomOverview";

export default function RoomPage() {
  const id = useRouter().query.room?.toString();
  const propertyId = useRouter().query.property?.toString();

  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});
  if (!id || !propertyId) return <>loading</>;

  return <RoomPageWithParams id={id} propertyId={propertyId} />;
}

type RoomPageWithParamsProps = {
  id: string;
  propertyId: string;
};

const RoomPageWithParams: React.FC<RoomPageWithParamsProps> = ({
  id,
  propertyId,
}) => {
  const {
    data: room,
    isLoading: roomLoading,
    error: roomError,
    failureReason: roomFailureReason,
  } = api.property.getRoom.useQuery({ id: id });
  const { data: property, isLoading: propertyLoading } =
    api.property.getPropertyForUser.useQuery({ id: propertyId });
  const { data: history, isLoading: historyLoading } =
    api.property.getHistoryForRoom.useQuery({ roomId: id });

  const forbidden = roomFailureReason?.message === "FORBIDDEN";

  // have some logic here, if has trade user, then display without any action buttons
  return (
    <PageWithMainMenu isHomeowner>
      {forbidden ? (
        <p>Forbidden</p>
      ) : roomLoading || propertyLoading ? (
        <LoadingSpinner />
      ) : !room || !property ? (
        <>Could not get Data</>
      ) : (
        <RoomPageWithRoom
          room={room}
          roomLoading={roomLoading}
          history={history}
          historyLoading={historyLoading}
          property={property}
        />
      )}
    </PageWithMainMenu>
  );
};

export type Job = RouterOutputs["job"]["getJob"];

type RoomPageWithRoomProps = {
  room: Room;
  roomLoading: boolean;
  history: RouterOutputs["property"]["getHistoryForRoom"] | undefined;
  historyLoading: boolean;
  property: RouterOutputs["property"]["getPropertyForUser"];
};

const RoomPageWithRoom: React.FC<RoomPageWithRoomProps> = ({
  room,
  roomLoading,
  history,
  historyLoading,
  property,
}) => {
  const { userId } = useAuth();

  //const isHomeowner = room. .Property.homeownerUserId === userId;

  const address = concatAddress(property);

  //Need to know whether the user is a Trade or Homeowner

  return (
    <>
      <RoomBreadcrumbs
        address={address}
        propertyId={property.id}
        roomLabel={room.label}
        roomId={room.id}
      />
      <PageTitle>{room.label}</PageTitle>
      <RoomPageNav propertyId={property.id} roomId={room.id} />
      <ResponsiveColumns>
        <ColumnOne>
          <TabListComponent
            title="Overview"
            href={`/property/${property.id}/rooms/${room.id}`}
            selected={true}
          />
        </ColumnOne>
        <ColumnTwo>
          <RoomOverview label={room.label} roomId={room.id} disabled={false} />
        </ColumnTwo>
      </ResponsiveColumns>
    </>
  );
};
