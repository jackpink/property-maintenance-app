import { Dispatch, SetStateAction } from "react";
import {
  RoomSelector,
  PropertyWithLevelAndRooms,
} from "../Molecules/RoomSelector";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";

type PropertyRoomSelectorProps = {
  property: PropertyWithLevelAndRooms;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onClickRoomAdd: (roomId: string) => void;
  onClickRoomRemove: (roomId: string) => void;
  checkRoomSelected: (roomId: string) => boolean;
  selectedRoom: string;
};

const PropertyRoomSelector: React.FC<PropertyRoomSelectorProps> = ({
  property,
  loading,
  setLoading,
  onClickRoomAdd,
  onClickRoomRemove,
  checkRoomSelected,
  selectedRoom,
}) => {
  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Rooms</PageSubTitle>
      </BackgroundContainerHeader>
      <RoomSelector
        property={property}
        onClickRoomAdd={onClickRoomAdd}
        onClickRoomRemove={onClickRoomRemove}
        loading={loading}
        setLoading={setLoading}
        checkRoomSelected={(roomId) => roomId === selectedRoom}
      />
    </BackgroundContainer>
  );
};

export default PropertyRoomSelector;
