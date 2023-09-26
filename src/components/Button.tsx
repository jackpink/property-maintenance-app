import clsx from "clsx"
import { ReactNode } from "react"

type ButtonProps = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    children: ReactNode,
    className?: string,
    value?: string
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, value }) => {
    return(
        <button value={(value)?(value):("value")} onClick={onClick} className={clsx("p-2 text-slate-900 font-extrabold text-xl border border-teal-800 rounded bg-teal-300", className)}>
            {children}
        </button>
    )
}
export default Button;