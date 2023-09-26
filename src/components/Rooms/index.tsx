import { type RouterOutputs } from '~/utils/api';
import RoomPopover from './RoomPopover';
import { RoomSelectorLevel } from './RoomSelector';
import type { SetStateAction, Dispatch } from 'react';

/* 
Need to create columns for the levels of the property, 
may need to define a max allowed levels, ie 6
Then just loop through the rooms for each level and 
add room buttons

will need useState to track current room

Then create a hidden version which is displayed on larger screen size
*/


type Levels = RouterOutputs["property"]["getPropertyForTradeUser"]["levels"];

type Level = Levels[number];

export type Room = Levels[number]["rooms"][number];

export type SelectedRoom = {
    room: Room | null,
    level: Level | null
}

type Props = {
    levels: Levels
    selectedRoom: SelectedRoom
    setSelectedRoom: Dispatch<SetStateAction<SelectedRoom>>
}

const Rooms: React.FC<Props> = ({ levels, selectedRoom, setSelectedRoom }) => {

    
    return(
        <RoomPopover selectedRoom={selectedRoom} >
            <div  className="flex flex-wrap gap-3 justify-center">
                {levels.map((level, index) => {
                    return(
                        <RoomSelectorLevel key={index} level={level} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
                    )}
                )}
                
            </div>
            
        </RoomPopover>
    )
} 

    export default Rooms;