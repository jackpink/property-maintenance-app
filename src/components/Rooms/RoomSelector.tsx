/*
We are storing an order value for levels and rooms
We could sort these on the front end before rendering, however, 
I think it would be best if this was handled in the backend, ideally
in the original sql queries for speed
*/

type RoomButtonProps = {
    room: IRoom
    selectedRoom: string
}

const RoomButton: React.FC<RoomButtonProps> = ({ room, selectedRoom }) => {
    console.group(selectedRoom)
    if ( room.label === selectedRoom ) {
        return(
            <button className="border rounded border-teal-800 bg-teal-300 p-2 sm:w-96 sm:justify-self-center" >{room.label}</button>
        )
    }
    return(
        <button className="border rounded border-teal-800 p-2 sm:w-96 sm:justify-self-center" >{room.label}</button>
    )
}

type Props = {
    levels: ILevel[]
    selectedRoom: string
}

const RoomSelectorOneLevel: React.FC<Props> = ({ levels, selectedRoom }) => {
    const level = levels[0];
    return(
        <div className="grid grid-cols-1 gap-2 text-center ">
            <h1>{level?.label}</h1>
            {level?.rooms.map((room, index) => 
                <RoomButton room={room} selectedRoom={selectedRoom} />
            )}
        </div>
    )
}


const RoomSelector: React.FC<Props> = ({ levels, selectedRoom }) => {
    const number_of_levels = levels.length;
    if (number_of_levels === 1) return(
        <RoomSelectorOneLevel levels={levels} selectedRoom={selectedRoom} />
    )
    else return(
        <>Error: too many levels</>
    )
}

export default RoomSelector;