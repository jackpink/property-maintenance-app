/*
We are storing an order value for levels and rooms
We could sort these on the front end before rendering, however, 
I think it would be best if this was handled in the backend, ideally
in the original sql queries for speed
*/
import type { SetStateAction, Dispatch } from 'react';
import clsx from 'clsx';
import type { selectedRoom } from '.';

type RoomButtonProps = {
    className: string
    room: IRoom
    level: ILevel
    selectedRoom: selectedRoom
    setSelectedRoom: Dispatch<SetStateAction<selectedRoom>>
}

export const RoomButton: React.FC<RoomButtonProps> = ({ className, room, level, selectedRoom, setSelectedRoom }) => {
    const ButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newSelectedRoom: selectedRoom = {level: level.label, room: event.currentTarget.value}
        setSelectedRoom(newSelectedRoom);
    }
    if ( room.label === selectedRoom.room && level.label === selectedRoom.level ) {
        return(
            <button value={room.label} className={clsx(className, "border-2 rounded border-teal-800 bg-teal-300 p-2")}  >{room.label}</button>
        )
    }
    return(
        <button value={room.label} onClick={ButtonClicked} className={clsx(className, "border rounded border-teal-800 p-2")} >{room.label}</button>
    )
}

type Props = {
    levels: ILevel[]
    selectedRoom: selectedRoom
    setSelectedRoom: Dispatch<SetStateAction<selectedRoom>>
}

export const RoomSelectorOneLevel: React.FC<Props> = ({ levels, selectedRoom, setSelectedRoom }) => {
    const level = levels[0];
    return(
        <div className="grid grid-cols-1 gap-2 text-center ">
            <h1>{level?.label}</h1>
            {level?.rooms.map((room, index) => 
                <RoomButton className="sm:w-96 sm:justify-self-center" key={index} room={room} level={level} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
            )}
        </div>
    )
}

export const RoomSelectorTwoLevel: React.FC<Props> = ({ levels, selectedRoom, setSelectedRoom }) => {
    const levelOne = levels[0];
    const levelTwo = levels[1];
    return(
        <div className="grid grid-cols-2 gap-4 text-center md:px-32 lg:px-48 3xl:mx-96">
            <div className="grid grid-cols-1 gap-4">
                <h1>{levelOne?.label}</h1>
                {levelOne?.rooms.map((room, index) => 
                    <RoomButton className="lg:w-72 lg:justify-self-center" key={index} room={room} level={levelOne} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
                )}
            </div>
            <div className="grid grid-cols-1 gap-4">
                <h1>{levelTwo?.label}</h1>
                {levelTwo?.rooms.map((room, index) => 
                    <RoomButton className="lg:w-72 lg:justify-self-center" key={index} room={room} level={levelTwo} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
                )}
            </div>
        </div>
    )
}
