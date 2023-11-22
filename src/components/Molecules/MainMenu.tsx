import { GhostButton } from "../Atoms/Button";

const MainMenu = () => {
  return (
    <div className="flex flex-col gap-4 px-8 pt-10 ">
      <GhostButton>Properties</GhostButton>
      <GhostButton>Alerts</GhostButton>
      <GhostButton>Account</GhostButton>
    </div>
  );
};

export default MainMenu;
