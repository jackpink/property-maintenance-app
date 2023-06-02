import RoomPopover from './RoomPopover';
import RoomSelector from './RoomSelector';
import { SetStateAction, Dispatch } from 'react';

/* 
Need to create columns for the levels of the property, 
may need to define a max allowed levels, ie 6
Then just loop through the rooms for each level and 
add room buttons

will need useState to track current room

Then create a hidden version which is displayed on larger screen size
*/

type Props = {
    levels: ILevel[]
    selectedRoom: string
    setSelectedRoom: Dispatch<SetStateAction<string>>
}

const Rooms: React.FC<Props> = ({ levels, selectedRoom, setSelectedRoom }) => {
    return (
        <div>
            <RoomPopover className="ml-2 -my-1" selectedRoom={selectedRoom} >
                <RoomSelector levels={levels} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
            </RoomPopover>
        </div>
    )}

    export default Rooms;