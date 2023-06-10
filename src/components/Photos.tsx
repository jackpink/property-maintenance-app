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
                    <Image
                        src={photo.url}
                        alt={photo.filename}
                        width={150}
                        height={150}
                        key={index}
                        />

                )
            })}
        </div>
    )
}

export default Photos;