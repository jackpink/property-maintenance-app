import clsx from "clsx";
import {
  useRef,
  type ReactNode,
  useEffect,
  use,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { Text } from "./Text";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";
import { toast } from "sonner";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
};

export const CTAButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  value,
  disabled,
  loading,
  rounded,
}) => {
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "rounded border border-dark bg-brand/80 p-2 text-xl font-extrabold text-dark",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait",
        rounded && "rounded-full border-0 p-6"
      )}
    >
      {children}
    </button>
  );
};

export function GhostButton({
  onClick,
  children,
  className,
  value,
  disabled,
  loading,
}: ButtonProps) {
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "rounded border border-dark bg-transparent p-2 text-dark",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait"
      )}
    >
      <Text className="font-sans">{children}</Text>
    </button>
  );
}

type DocumentButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function DocumentButton({
  label,
  onClick,
  className,
  disabled,
  loading,
}: DocumentButtonProps) {
  return (
    <button
      className={clsx(
        "m-2 flex flex-col items-center justify-center",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait"
      )}
      onClick={onClick}
    >
      <svg width="60" viewBox="0 0 130 170">
        <g id="layer1" transform="translate(-246.43 -187.36)">
          <path
            id="rect7452"
            d="m246.43 187.36v170h130v-141.34l-28.625-28.656h-101.38zm97.5 5 27.5 27.531h-27.5v-27.531zm-72.5 61.188h80v7h-80v-7zm0 30.625h80v7h-80v-7zm0 30.656h80v7h-80v-7z"
          />
        </g>
      </svg>
      <Text className="font-sans text-dark">{label}</Text>
    </button>
  );
}

export function PlusIcon({
  width = "20",
  height = "20",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" version="1.1">
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Icon-Set-Filled"
          transform="translate(-362.000000, -1037.000000)"
          fill="#000000"
        >
          <path
            d="M390,1049 L382,1049 L382,1041 C382,1038.79 380.209,1037 378,1037 C375.791,1037 374,1038.79 374,1041 L374,1049 L366,1049 C363.791,1049 362,1050.79 362,1053 C362,1055.21 363.791,1057 366,1057 L374,1057 L374,1065 C374,1067.21 375.791,1069 378,1069 C380.209,1069 382,1067.21 382,1065 L382,1057 L390,1057 C392.209,1057 394,1055.21 394,1053 C394,1050.79 392.209,1049 390,1049"
            id="plus"
          ></path>
        </g>
      </g>
    </svg>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <>
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 21H6.2C5.0799 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V10M7 3V5M17 3V5M3 9H21M13.5 13.0001L7 13M10 17.0001L7 17M14 21L16.025 20.595C16.2015 20.5597 16.2898 20.542 16.3721 20.5097C16.4452 20.4811 16.5147 20.4439 16.579 20.399C16.6516 20.3484 16.7152 20.2848 16.8426 20.1574L21 16C21.5523 15.4477 21.5523 14.5523 21 14C20.4477 13.4477 19.5523 13.4477 19 14L14.8426 18.1574C14.7152 18.2848 14.6516 18.3484 14.601 18.421C14.5561 18.4853 14.5189 18.5548 14.4903 18.6279C14.458 18.7102 14.4403 18.7985 14.405 18.975L14 21Z"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </>
  );
}

const ButtonDisabledToast = () => {
  toast("You are not authorised to change this");
};

type EditCalenderButtonProps = {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

export function EditCalenderButton({
  onClick,
  className,
  disabled = false,
}: EditCalenderButtonProps) {
  return (
    <button
      className={clsx(className, disabled && "cursor-not-allowed opacity-50")}
      onClick={disabled ? ButtonDisabledToast : onClick}
    >
      <CalendarIcon />
    </button>
  );
}

type DefaultDocumentButtonProps = {
  label: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function DefaultDocumentButton({
  label,
  className,
  disabled,
  loading,
}: DefaultDocumentButtonProps) {
  return (
    <div
      className={clsx(
        " border-1 rounded-full border border-dark bg-brand p-4 text-center text-dark"
      )}
    >
      <Text className="p-2 font-sans font-extrabold">
        {loading ? "Uploading..." : "Add " + label}
      </Text>
      <div className={clsx("grid place-items-center")}>
        {!loading ? (
          <PlusIcon />
        ) : (
          <div className="h-5 w-5">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
type UploadButtonProps = {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export function UploadButton({
  className,
  disabled,
  loading,
  children,
}: React.PropsWithChildren<UploadButtonProps>) {
  return (
    <div
      className={clsx(
        "cursor-pointer rounded border border-dark bg-brand p-2 font-sans text-xl font-extrabold text-dark",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "cursor-wait"
      )}
    >
      {loading ? (
        <div className="flex flex-row">
          <div className="h-8 w-8">
            <LoadingSpinner />
          </div>
          <div>Uploading...</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

type EditButtonProps = {
  onClick: () => void;
  className?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
};

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  className,
  width = "50px",
  height = "50px",
  disabled = false,
}) => {
  return (
    <button
      onClick={disabled ? ButtonDisabledToast : onClick}
      className={clsx(className, disabled && "cursor-not-allowed opacity-50")}
    >
      <EditIcon width={width} height={height} />
    </button>
  );
};

export function EditIcon({ width, height }: { width: string; height: string }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 -0.5 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7 5.12758L19.266 6.37458C19.4172 6.51691 19.5025 6.71571 19.5013 6.92339C19.5002 7.13106 19.4128 7.32892 19.26 7.46958L18.07 8.89358L14.021 13.7226C13.9501 13.8037 13.8558 13.8607 13.751 13.8856L11.651 14.3616C11.3755 14.3754 11.1356 14.1751 11.1 13.9016V11.7436C11.1071 11.6395 11.149 11.5409 11.219 11.4636L15.193 6.97058L16.557 5.34158C16.8268 4.98786 17.3204 4.89545 17.7 5.12758Z"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.033 7.61865C12.4472 7.61865 12.783 7.28287 12.783 6.86865C12.783 6.45444 12.4472 6.11865 12.033 6.11865V7.61865ZM9.23301 6.86865V6.11865L9.23121 6.11865L9.23301 6.86865ZM5.50001 10.6187H6.25001L6.25001 10.617L5.50001 10.6187ZM5.50001 16.2437L6.25001 16.2453V16.2437H5.50001ZM9.23301 19.9937L9.23121 20.7437H9.23301V19.9937ZM14.833 19.9937V20.7437L14.8348 20.7437L14.833 19.9937ZM18.566 16.2437H17.816L17.816 16.2453L18.566 16.2437ZM19.316 12.4937C19.316 12.0794 18.9802 11.7437 18.566 11.7437C18.1518 11.7437 17.816 12.0794 17.816 12.4937H19.316ZM15.8863 6.68446C15.7282 6.30159 15.2897 6.11934 14.9068 6.2774C14.5239 6.43546 14.3417 6.87397 14.4998 7.25684L15.8863 6.68446ZM18.2319 9.62197C18.6363 9.53257 18.8917 9.13222 18.8023 8.72777C18.7129 8.32332 18.3126 8.06792 17.9081 8.15733L18.2319 9.62197ZM8.30001 16.4317C7.8858 16.4317 7.55001 16.7674 7.55001 17.1817C7.55001 17.5959 7.8858 17.9317 8.30001 17.9317V16.4317ZM15.767 17.9317C16.1812 17.9317 16.517 17.5959 16.517 17.1817C16.517 16.7674 16.1812 16.4317 15.767 16.4317V17.9317ZM12.033 6.11865H9.23301V7.61865H12.033V6.11865ZM9.23121 6.11865C6.75081 6.12461 4.7447 8.13986 4.75001 10.6203L6.25001 10.617C6.24647 8.96492 7.58269 7.62262 9.23481 7.61865L9.23121 6.11865ZM4.75001 10.6187V16.2437H6.25001V10.6187H4.75001ZM4.75001 16.242C4.7447 18.7224 6.75081 20.7377 9.23121 20.7437L9.23481 19.2437C7.58269 19.2397 6.24647 17.8974 6.25001 16.2453L4.75001 16.242ZM9.23301 20.7437H14.833V19.2437H9.23301V20.7437ZM14.8348 20.7437C17.3152 20.7377 19.3213 18.7224 19.316 16.242L17.816 16.2453C17.8195 17.8974 16.4833 19.2397 14.8312 19.2437L14.8348 20.7437ZM19.316 16.2437V12.4937H17.816V16.2437H19.316ZM14.4998 7.25684C14.6947 7.72897 15.0923 8.39815 15.6866 8.91521C16.2944 9.44412 17.1679 9.85718 18.2319 9.62197L17.9081 8.15733C17.4431 8.26012 17.0391 8.10369 16.6712 7.7836C16.2897 7.45165 16.0134 6.99233 15.8863 6.68446L14.4998 7.25684ZM8.30001 17.9317H15.767V16.4317H8.30001V17.9317Z"
        fill="#000000"
      />
    </svg>
  );
}

type LargeButtonProps = {
  onClick?: () => void;
};

export const LargeButton: React.FC<
  React.PropsWithChildren<LargeButtonProps>
> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-brand p-4  hover:bg-brand/70"
    >
      {children}
    </button>
  );
};

export const LargeButtonTitle: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Text className="font-sans text-2xl font-bold text-dark">{children} →</Text>
  );
};

export const LargeButtonContent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <Text className="font-sans text-lg text-dark">{children}</Text>;
};

type NavMenuButtonProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

export function NavMenuButton({
  isOpen,
  setIsOpen,
  className,
}: NavMenuButtonProps) {
  return (
    <button onClick={() => setIsOpen(!isOpen)} className={className}>
      <div className="flex h-10 w-10 flex-col gap-2">
        <span
          className={clsx(
            "h-2 transform rounded-full bg-black transition duration-500 ease-in-out",
            isOpen && "translate-y-4 rotate-45"
          )}
        ></span>
        <span
          className={clsx(
            "h-2 rounded-full bg-black transition duration-500 ease-in-out",
            isOpen && "rotate-[-45deg]"
          )}
        ></span>
        <span
          className={clsx(
            "h-2 w-6 rounded-full bg-black transition duration-500 ease-in-out",
            isOpen && "bg-transparent"
          )}
        ></span>
      </div>
    </button>
  );
}
