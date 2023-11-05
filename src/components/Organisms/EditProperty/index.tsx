import { type RouterOutputs } from "~/utils/api";
import { useState } from "react";
import AddLevelButton from "./AddLevel";
import Level from "./Level";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "~/components/Atoms/BackgroundContainer";
import { PageSubTitle } from "~/components/Atoms/Title";
import { Text } from "~/components/Atoms/Text";

// build the property page
// get params, get Property by Id
// edit and add levels and rooms
// search photos
// add new job ----> new job upload photos, assgin to rooms

type Property = RouterOutputs["property"]["getPropertyForUser"];

type EditPropertyProps = {
  property: Property;
};

const EditProperty: React.FC<EditPropertyProps> = ({ property }) => {
  const [editPropertyMode, setEditPropertyMode] = useState(false);
  // Edit Property button should not show if property has no levels,
  // instead a prompt to add levels and rooms to start building property
  const propertyHasNoLevels = property.levels.length === 0;

  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Edit Property</PageSubTitle>
      </BackgroundContainerHeader>
      {propertyHasNoLevels && (
        <Text>
          This Property currently has no levels or rooms, start by first adding
          a level below
        </Text>
      )}

      <div className="flex flex-wrap justify-center gap-3 pt-6">
        {property.levels.map((level, index) => {
          return <Level level={level} key={index} />;
        })}
        {editPropertyMode ? null : <AddLevelButton propertyId={property.id} />}
      </div>
    </BackgroundContainer>
  );
};

export default EditProperty;
