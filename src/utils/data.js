import { IoHomeSharp } from "react-icons/io5";
import { GiSouthKorea } from "react-icons/gi";
import { FaHotjar } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { RiDoorOpenFill } from "react-icons/ri";
import { TbStarsFilled } from "react-icons/tb";

export const navMenus = [
  { label: "Home", to: "/", icon: <IoHomeSharp className="w-5 h-5" />, idx: 0 },
  {
    label: "Area",
    to: "/area",
    icon: <GiSouthKorea className="w-5 h-5" />,
    idx: 1,
  },
  {
    label: "Theme",
    to: "/theme",
    icon: <TbCategoryFilled className="w-5 h-5" />,
    idx: 2,
  },
  { label: "Hot", to: "/hot", icon: <FaHotjar className="w-5 h-5" />, idx: 3 },
  {
    label: "Visited",
    to: "/visited",
    icon: <RiDoorOpenFill className="w-5 h-5" />,
    idx: 4,
  },
  {
    label: "Review",
    to: "/review",
    icon: <TbStarsFilled className="w-5 h-5" />,
    idx: 5,
  },
];

export const themenavbar = [
  { label: "일출명소", idx: 0 },
  { label: "일몰명소", idx: 1 },
  { label: "수상레저", idx: 2 },
  { label: "항공레저", idx: 3 },
  { label: "스키", idx: 4 },
  { label: "낚시", idx: 5 },
  { label: "엑티비티", idx: 6 },
  { label: "불꽃여행", idx: 7 },
  { label: "여름물놀이", idx: 8 },
  { label: "가을단풍명소", idx: 9 },
  { label: "겨울눈꽃명소", idx: 10 },
  { label: "걷기길", idx: 11 },
];
