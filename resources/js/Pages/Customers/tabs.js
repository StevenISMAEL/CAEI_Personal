import { IoPeopleSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaMapMarked } from "react-icons/fa";
import { PiCityFill } from "react-icons/pi";

const tabs = [
    {
        name: "Clientes",
        route: "clients",
        icon: IoPeopleSharp,
    },
    {
        name: "Telefonos",
        route: "phones",
        icon: FaPhone,
    },
    {
        name: "Direcciones",
        route: "addresses",
        icon: FaHome,
    },
    {
        name: "Parroquias",
        route: "parishes",
        icon: FaMapMarked,
    },
    {
        name: "Cantones",
        route: "cantons",
        icon: PiCityFill,
    },
];

export default tabs;
