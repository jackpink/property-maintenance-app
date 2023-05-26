import { useState } from "react";
import { useEffect } from "react";
import Property from "./Property";
import PropertySearch from "./PropertySearch";

const filterProperties= (properties: IProperty[], term: string): IProperty[] => {
    // if type and job.type match then keep
    const filteredProperties: IProperty[] = []
    properties.forEach(property => {
        const suburb = property.suburb.toLowerCase();
        const postcode = property.postcode;
        const suburbMatch: boolean = suburb.includes(term.toLowerCase());
        const postcodeMatch: boolean = postcode.includes(term);
        if (suburbMatch || postcodeMatch) {
            filteredProperties.push(property)
            //console.log(job.type, typeValue)
        }
    });
    return filteredProperties;
}

type Props = {
    properties: IProperty[]
}

const Properties: React.FC<Props> = ({ properties} ) => {
    const [filteredProperties, setFilteredProperties] = useState(properties);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const newFilteredProperties = filterProperties(properties, searchTerm);
        setFilteredProperties(newFilteredProperties);
    }, [searchTerm, properties])

    console.log(searchTerm);
    console.log(filteredProperties);
    return(
        <div>
            <PropertySearch setSearchTerm={setSearchTerm}/>
            <div className="flex flex-col space-y-4">
            {filteredProperties.map((property, index) =>
                <Property property={property} key={index}/>
            )}
            </div>
        </div>
    )
}

export default Properties;