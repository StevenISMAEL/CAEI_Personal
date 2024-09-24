import { RiFolderSharedFill } from "react-icons/ri";
import { TbFilterStar } from "react-icons/tb";


const tabs = [
    {
        name: "Trámites",
        route: "tramite.index",
        icon: RiFolderSharedFill,
    },
    {
        name: "Filtrar Trámites",
        route: "Tramitefechas.index",
        icon: TbFilterStar,
    },
  
];

export default tabs;