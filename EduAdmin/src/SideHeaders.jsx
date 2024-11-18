import { Link } from "react-router-dom";
import Bottons from "./Components/Bottons";

export default function SideHeaders() {
  return (
    <div className="w-[300px]  flex items-center justify-center flex-col shadow-sm stroke-zinc-400">
      <div className="h-[95%] w-[90%] rounded-lg  shadow-sm shadow-zinc-200  bg-opacity-25">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-[54px] h-[54px] bg-zinc-100 rounded-full"></div>
          <div className="text-black font-bold text-lg mt-2">User</div>
          <p className="text-[11px] text-purple-600 ">Admin</p>
        </div>
        <div className=" w-full flex flex-col mt-[30px] ">
          <Link to={"/"}>
            <Bottons name="Dashboard" />
          </Link>
          <Link to={"/cafe"}>
            <Bottons name="CafeController" />
          </Link>
          <Link to={"/complain"}>
            <Bottons name="Complains" />
          </Link>
          <Link to={"/student"}>
            <Bottons name="Students" />
          </Link>
          <Link to={"/Acadamics"}>
            <Bottons name="Acadamics" />
          </Link>
          <Link to={"/SocialClubs"}>
            <Bottons name="SocialClubs" />
          </Link>
          <Link to={"/Event"}>
            <Bottons name="Event" />
          </Link>
        </div>
      </div>
    </div>
  );
}
