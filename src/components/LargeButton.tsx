type LargeButtonProps = {
  onClick?: () => void;
};

export const LargeButton: React.FC<
  React.PropsWithChildren<LargeButtonProps>
> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-black/20 p-4 text-teal-800 hover:bg-black/30"
    >
      {children}
    </button>
  );
};

export const LargeButtonTitle: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <h3 className="text-2xl font-bold">{children} →</h3>;
};

export const LargeButtonContent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <div className="text-lg">{children}</div>;
};
