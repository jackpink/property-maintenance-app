import clsx from "clsx";
import { type ReactNode } from "react";
import { Text } from "./Text";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
};

export const CTAButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  value,
  disabled,
  loading,
}) => {
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "rounded border border-teal-800 bg-teal-300 p-2 text-xl font-extrabold text-slate-900",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait"
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
        "rounded border border-teal-800 bg-transparent p-2 text-slate-900",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait"
      )}
    >
      <Text>{children}</Text>
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
        "m-2 p-2",
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
      <p>{label}</p>
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

type EditCalenderButtonProps = {
  onClick: () => void;
};

export function EditCalenderButton({ onClick }: EditCalenderButtonProps) {
  return (
    <button onClick={onClick}>
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
        " border-1 rounded-md border border-black bg-teal-300 pb-2 text-center"
      )}
    >
      <Text className="p-2 font-extrabold">
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
        "cursor-pointer rounded border border-teal-800 bg-teal-300 p-2 text-xl font-extrabold text-slate-900",
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
};

export const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <GhostButton className="absolute -top-3 right-0" onClick={onClick}>
      <p className="inline-block">{"Edit" + "  "}</p>
      <Image
        className="inline-block"
        src="/edit_button.svg"
        alt="Edit"
        width={30}
        height={30}
      />
    </GhostButton>
  );
};
