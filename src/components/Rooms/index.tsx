import RoomPopover from './RoomPopover';
import { RoomSelectorOneLevel, RoomSelectorTwoLevel } from './RoomSelector';
import { SetStateAction, Dispatch } from 'react';

/* 
Need to create columns for the levels of the property, 
may need to define a max allowed levels, ie 6
Then just loop through the rooms for each level and 
add room buttons

will need useState to track current room

Then create a hidden version which is displayed on larger screen size
*/
export type selectedRoom = {
    level: string
    room: string
}


type Props = {
    levels: ILevel[]
    selectedRoom: selectedRoom
    setSelectedRoom: Dispatch<SetStateAction<selectedRoom>>
}

const Rooms: React.FC<Props> = ({ levels, selectedRoom, setSelectedRoom }) => {
const number_of_levels = levels.length;
if (number_of_levels === 1) {
    return(
        <RoomPopover selectedRoom={selectedRoom} >
            <RoomSelectorOneLevel levels={levels} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
        </RoomPopover>
    )
} else if (number_of_levels === 2) {
    return(
        <RoomPopover selectedRoom={selectedRoom} >
            <RoomSelectorTwoLevel levels={levels} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
        </RoomPopover>
    )
}
    return (
        <>Error: too many levels</>
    )}

    export default Rooms;