import Link from "next/link";
import { GhostButton } from "../Atoms/Button";

const MainMenu = () => {
  return (
    <div className="flex flex-col gap-4 px-8 pt-10 ">
      <Link href="/properties">
        <GhostButton>Properties</GhostButton>
      </Link>
      <GhostButton>Alerts</GhostButton>
      <GhostButton>Account</GhostButton>
    </div>
  );
};

export default MainMenu;
