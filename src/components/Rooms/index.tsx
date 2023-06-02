import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import RoomPopover from './RoomPopover';

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
}

const Rooms: React.FC<Props> = ({ levels, selectedRoom }) => {
    return (
        <div>
            <RoomPopover className="ml-2 -my-1"  levels={levels} selectedRoom={selectedRoom} />
        </div>
    )}

    export default Rooms;