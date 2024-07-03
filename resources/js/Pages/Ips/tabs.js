
import { TbCloudNetwork } from "react-icons/tb";
import { LuNetwork } from "react-icons/lu";
const tabs = [
    {
        name: "Olts",
        route: "olts.index",
        icon: TbCloudNetwork,
    },
    {
        name: "Naps de distribución",
        route: "distributionNaps.index",
        icon: LuNetwork,
    },
    {
        name: "Naps Ultima Milla",
        route: "lastmileNaps.index",
        icon: LuNetwork,
    },
    {
        name: "Ips",
        route: "ips.index",
        icon: LuNetwork,
    },
];

export default tabs;