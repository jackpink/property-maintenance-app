import React, { MouseEventHandler } from "react";
import clsx from 'clsx';


type selectedEvent = {
    id: string
}

export interface ElementProps {
    label: string,
    id: string,
    onClick: MouseEventHandler<HTMLButtonElement> 
    selectedEvent: selectedEvent
  }
/* a potentially handy typescript function, but also could indicate badly writen code
function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
if (argument === undefined || argument === null) {
    throw new TypeError(message);
}

return argument;
}
*/

const Element: React.FC<ElementProps> = (props) => {

    const { label, selectedEvent, id, onClick  } = props;

    const checked:boolean = id === selectedEvent.id;
    console.log(checked, id, selectedEvent.id);

    return(
        <li className="table-cell relative text-sm">
            <div  className="flex flex-wrap" >
                <span className="flex-1 whitespace-nowrap bg-black my-3"></span>
                <button value={id} onClick={onClick} className={clsx("h-8", "w-8", "flex-none", "border-2", "border-solid", "border-black", "rounded-2xl", "whitespace-nowrap", {"bg-emerald-600":checked, "after:content-['✓']":checked})} id="element-radio"></button>
                <span className="flex-1 whitespace-nowrap bg-black my-3"></span>
                <span className="flex-1 basis-full w-0"></span>
                <button value={id} onClick={onClick} className="px-4 basis-full top-24 min-w-max">{label}</button>
            </div>
        </li>
    )
}

export default Element;