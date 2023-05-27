import { type Dispatch, type SetStateAction } from 'react';


type Props = {
    setSearchTerm: Dispatch<SetStateAction<string>>;
}

const PropertySearch: React.FC<Props> = ({ setSearchTerm }) => {

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        setSearchTerm(event.currentTarget.value);
    }

    return(
        <div className="mb-3">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <input
            type="search"
            className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-teal-700 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(13,148,136)] focus:outline-none dark:border-teal-600 dark:text-teal-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search by suburb or postcode"
            onChange={handleChange} />

            <button
            className="relative z-[2] flex items-center rounded-r bg-teal-500 px-6 py-2.5 text-xs font-medium border border-solid border-teal-700 uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg"
            type="button"
            id="button-addon1"
            data-te-ripple-init
            data-te-ripple-color="light">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd" />
            </svg>
            </button>
        </div>
        </div>
    )
}

export default PropertySearch;