import { api } from "~/utils/api";
import LoadingSpinner from "../Atoms/LoadingSpinner";
import Properties from "../Molecules/Properties";
import { Text } from "../Atoms/Text";
import {
  BackgroundContainer,
  BackgroundContainerHeader,
} from "../Atoms/BackgroundContainer";
import { PageSubTitle } from "../Atoms/Title";

type DashboardPropertiesProps = {
  userId: string;
};

const DashboardProperties: React.FC<DashboardPropertiesProps> = ({
  userId,
}) => {
  const { data: properties, isLoading } =
    api.property.getPropertiesForHomeownerUser.useQuery({
      user: userId,
    });

  return (
    <BackgroundContainer>
      <BackgroundContainerHeader>
        <PageSubTitle>Properties</PageSubTitle>
      </BackgroundContainerHeader>
      {isLoading && (
        <div className="h-20 w-20">
          <LoadingSpinner />
        </div>
      )}
      {!properties ? (
        <Text className="text-center">Failed to load properties</Text>
      ) : properties.length > 0 ? (
        <div className="p-8">
          <Properties properties={properties} />
        </div>
      ) : (
        <Text className="text-center">
          You don&apos;t have any properties yet
        </Text>
      )}
    </BackgroundContainer>
  );
};
export default DashboardProperties;
