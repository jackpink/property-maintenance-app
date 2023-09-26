import { type ReactNode, useRef, useEffect } from "react"

type ClickAwayListenerProps = {
    children: ReactNode,
    clickOutsideAction: () => void
}

 const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({ children, clickOutsideAction }) => {

    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if( ref.current && !ref.current.contains(event.target)) {
                clickOutsideAction();
                // toggle current
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, [clickOutsideAction]);

    return(
        <div ref={ref} >
            {children}
        </div>
    )
 }

 export default ClickAwayListener;