import Property from "./Property";

type Props = {
    properties: IProperty[]
}

const Properties: React.FC<Props> = ({ properties} ) => {
    return(
        <div className="grid grid-cols-1 gap-4 col-span-7 w-9/12 lg:w-7/12 xl:w-128">
        {properties.map((property, index) =>
            <Property property={property} key={index}/>
        )}
        </div>
    )
}

export default Properties;