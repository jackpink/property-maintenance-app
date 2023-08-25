/*
    Will need to get signed url from server
    then use url for loading image   */
import Image from "next/image"


type Props = {
    photos: IPhoto[]
}

const Photos: React.FC<Props> = ({ photos }) => {

    return(
        <div className="flex flex-wrap gap-4 pt-8 justify-center">
            {photos.map((photo, index) => {
                return(
                    <Photo key={index} photo={photo} />
                )
            })}
        </div>
    )
}

export default Photos;

type PhotoProps = {
    photo: IPhoto
}

const Photo: React.FC<PhotoProps> = ({ photo }) => {

    return(
        <Image
                        src={photo.url}
                        alt={photo.filename}
                        width={130}
                        height={130}
                        />

    )
}