/*
We are storing an order value for levels and rooms
We could sort these on the front end before rendering, however, 
I think it would be best if this was handled in the backend, ideally
in the original sql queries for speed
*/
import type { SetStateAction, Dispatch } from 'react';
import clsx from 'clsx';
import type { SelectedRoom } from './index';
import { RouterOutputs } from '~/utils/api';

type Level = RouterOutputs["property"]["getPropertyForTradeUser"]["levels"][number];

type Room = Level["rooms"][number];

type RoomButtonProps = {
    className: string
    room: Room
    level: Level
    selectedRoom: SelectedRoom
    setSelectedRoom: Dispatch<SetStateAction<SelectedRoom>>
}

export const RoomButton: React.FC<RoomButtonProps> = ({ className, room, level, selectedRoom, setSelectedRoom }) => {
    const ButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newSelectedRoom: SelectedRoom = {level: level, room: room};
        console.log("new selected room", newSelectedRoom);
        setSelectedRoom(newSelectedRoom);
    }
    if ( room.id === selectedRoom.room?.id ) {
        return(
            <button className={clsx(className, "border-2 rounded border-teal-800 bg-teal-300 p-2")}  >{room.label}</button>
        )
    }
    return(
        <button onClick={ButtonClicked} className={clsx(className, "border rounded border-teal-800 p-2")} >{room.label}</button>
    )
}



type Props = {
    level: Level
    selectedRoom: SelectedRoom 
    setSelectedRoom: Dispatch<SetStateAction<SelectedRoom>>
}

export const RoomSelectorLevel: React.FC<Props> = ({ level, selectedRoom, setSelectedRoom }) => {
    return(
        <div className="grid grid-cols-1 gap-2 text-center ">
            <h1>{level.label}</h1>
            {level.rooms.map((room, index) => 
                <RoomButton className=" w-96 justify-self-center" key={index} room={room} level={level} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
            )}
        </div>
    )
}
/*
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
*/