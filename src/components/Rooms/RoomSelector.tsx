import clsx from 'clsx';
import { number } from 'zod';


type Props = {
    levels: ILevel[]
}

const RoomSelectorOneLevel: React.FC<Props> = ({ levels }) => {
    const level = levels[0];
    return(
        <div className="grid grid-cols-1 text-center">
            <h1>{level?.label}</h1>
            <button>room</button>
        </div>
    )
}


const RoomSelector: React.FC<Props> = ({ levels }) => {
    const number_of_levels = levels.length;
    console.log(number_of_levels);
    if (number_of_levels === 1) return(
        <RoomSelectorOneLevel levels={levels} />
    )
    else return(
        <>Error: too many levels</>
    )
}

export default RoomSelector;