import { IoPeopleSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaMapMarked } from "react-icons/fa";
import { PiCityFill } from "react-icons/pi";

const tabs = [
    {
        name: "Clientes",
        route: "clients.index",
        icon: IoPeopleSharp,
    },
    {
        name: "Telefonos",
        route: "phones.index",
        icon: FaPhone,
    },
    {
        name: "Direcciones",
        route: "addresses.index",
        icon: FaHome,
    },
    {
        name: "Parroquias",
        route: "parishes.index",
        icon: FaMapMarked,
    },
    {
        name: "Cantones",
        route: "cantons.index",
        icon: PiCityFill,
    },
];

export default tabs;
