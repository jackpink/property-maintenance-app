/*
We are storing an order value for levels and rooms
We could sort these on the front end before rendering, however, 
I think it would be best if this was handled in the backend, ideally
in the original sql queries for speed
*/
import type { SetStateAction, Dispatch } from 'react';


type RoomButtonProps = {
    room: IRoom
    selectedRoom: string
    setSelectedRoom: Dispatch<SetStateAction<string>>
}

const RoomButton: React.FC<RoomButtonProps> = ({ room, selectedRoom, setSelectedRoom }) => {
    const ButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSelectedRoom(event.currentTarget.value);
    }
    if ( room.label === selectedRoom ) {
        return(
            <button value={room.label} className="border rounded border-teal-800 bg-teal-300 p-2 sm:w-96 sm:justify-self-center" >{room.label}</button>
        )
    }
    return(
        <button value={room.label} onClick={ButtonClicked} className="border rounded border-teal-800 p-2 sm:w-96 sm:justify-self-center" >{room.label}</button>
    )
}

type Props = {
    levels: ILevel[]
    selectedRoom: string
    setSelectedRoom: Dispatch<SetStateAction<string>>
}

 export const RoomSelectorOneLevel: React.FC<Props> = ({ levels, selectedRoom, setSelectedRoom }) => {
    const level = levels[0];
    return(
        <div className="grid grid-cols-1 gap-2 text-center ">
            <h1>{level?.label}</h1>
            {level?.rooms.map((room, index) => 
                <RoomButton key={index} room={room} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
            )}
        </div>
    )
}


const RoomSelector: React.FC<Props> = ({ levels, selectedRoom, setSelectedRoom }) => {
    const number_of_levels = levels.length;
    if (number_of_levels === 1) return(
        <RoomSelectorOneLevel levels={levels} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
    )
    else return(
        <>Error: too many levels</>
    )
}

export default RoomSelector;