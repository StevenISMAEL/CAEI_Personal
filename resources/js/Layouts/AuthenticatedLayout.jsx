import React, { useState, useEffect, useContext } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { RiDashboard2Fill } from "react-icons/ri";
import LinkCustom from "@/Components/LinkCustom";
import { Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import ApplicationLogo from "@/Components/ApplicationLogo";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import DarkModeToggle from "@/Components/NightMode";
import { DarkModeContext } from "@/Components/DarkModeContext";
import { TbMapShare } from "react-icons/tb";
import { FaUsersGear } from "react-icons/fa6";
import { FaFileContract } from "react-icons/fa6";
import SessionExpiredModal from "@/Components/SessionExpiredModal";
import useSessionChecker from "@/Hooks/useSessionChecker";
import { Tooltip } from "react-tooltip";
import { useNotify } from "@/Components/Toast";
import { BiSolidCategory } from "react-icons/bi";
import { VscFileSymlinkFile } from "react-icons/vsc";
import { AiOutlineAudit } from "react-icons/ai";
import { TbMapStar } from "react-icons/tb";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbPuzzle2 } from "react-icons/tb";
import { FaFileUpload } from "react-icons/fa";
import { MdNotificationAdd } from "react-icons/md";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import ButtonCustom from "@/Components/ButtonCustom";

const Authenticated = ({ user, header, children, roles = ["admin"] }) => {
    const { env } = usePage().props; //contiene variables de entorno como el tiempo de sesion de la pagina
    const { sessionActive } = useSessionChecker(env.SESSION_LIFETIME); //verifica si la sesion esta activa
    const [showSessionModal, setShowSessionModal] = useState(false); //muestra el modal de sesion expirada

    const { flash } = usePage().props; //contiene los mensajes flash
    const notify = useNotify(); //  funcion para mostrar notificaciones
    const [message, setMessage] = useState(flash.message); //mensaje de notificacion
    const [messageType, setMessageType] = useState(flash.type); //tipo de notificacion

    const [showProjects, setShowProjects] = useState(false);  // Estado para controlar la visibilidad de las opciones de "Proyectos"



    /*si el mensaje es True correspondería a mostrar la notificación/mensaje*/
    useEffect(() => {
        if (message) {
            notify(messageType, message, { autoClose: 5000 }); //muestra la notificacion
            setMessage(null); //limpia el mensaje
            setMessageType(null); //limpia el tipo de mensaje
        }
    }, [message, messageType]);

    useEffect(() => {
        if (flash.message) {
            setMessage(flash.message);
            setMessageType(flash.type);
        }
    }, [flash]);

    /*si la sesion no esta activa muestra el modal de sesion expirada*/
    useEffect(() => {
        if (!sessionActive) {
            setShowSessionModal(true);
        }
    }, [sessionActive]);

    /*funcion para obtener el estado del sidebar*/
    const getSidebarStatus = () => {
        const value = localStorage.getItem("open");
        return value === "true" || value === null;
    };

    const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [open, setOpen] = useState(getSidebarStatus);

    useEffect(() => {
        localStorage.setItem("open", open.toString());
    }, [open]);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);


    const currentUrl = window.location.pathname;

    // Nuevo efecto para mantener el menú abierto
    useEffect(() => {
        const proyectosMenu = Menus.find(menu => menu.title === "Proyectos");
        if (proyectosMenu?.children) {
            const isChildActive = proyectosMenu.children.some(child => 
                route().current(child.route)
            );
            
            if (isChildActive && !showProjects) {
                setShowProjects(true);
            }
        }
    }, [currentUrl]);


    const Menus = [
        {
            title: "Dashboard",
            route: "dashboard",
            icon: <RiDashboard2Fill />,
            roles: ["admin", "arquitectorevisor", "secretaria"],
        },
        {
            title: "Usuarios",
            route: "usuarios.index",
            icon: <FaUsersGear />,
            roles: ["admin"],
        },
        {
            title: "Documentación",
            route: "documentaciones.index",
            subroute: "/administrar-documentacion/",
            icon: <FaFileUpload />,
            roles: ["admin", "arquitectorevisor", "secretaria"],
        },
        {
            title: "Notificaciones",
            route: "notificaciones.index",
            subroute: "/administrar-notificaciones/",
            icon: <MdNotificationAdd />,
            roles: ["admin", "arquitectorevisor", "secretaria"],
        },
        {
            title: "Categorías",
            route: "categoria.index",
            subroute: "/administrar-tipotramites/",
            icon: <BiSolidCategory />,
            roles: ["admin", "arquitectorevisor", "secretaria"],
        },
        {
            title: "Trámites",
            route: "tramite.index",
            subroute: "/administrar-tramites/",
            icon: <VscFileSymlinkFile />,
            roles: ["admin", "secretaria"],
        },

        {
            title: "Proyectos",
            icon: <TbMapShare />,
            roles: ["admin", "arquitectorevisor"],
            children: [
                {
                    title: "Planos Arquitectónicos",
                    route: "planoarq.index",
                    subroute: "/administrar-planos-arquitectonicos/",
                    icon: <FaFileContract />,
                },
                {
                    title: "Fraccionamientos",
                    route: "fraccionamiento.index",
                    subroute: "/administrar-fraccionamientos/",
                    icon: <TbMapStar />,
                },
                {
                    title: "Trabajos Varios",
                    route: "trabajosvar.index",
                    subroute: "/administrar-trabajos-varios/",  
                    icon: <HiMiniClipboardDocumentList />,
                },
                {
                    title: "Propiedad Horizontal",
                    route: "propiedadh.index",
                    subroute: "/administrar-propiedad-horizontal/",
                    icon: <TbMapShare />,
                },
                {
                    title: "Aforos",
                    route: "aforos.index",
                    subroute: "/administrar-aforos/",
                    icon: <FaPeopleGroup />,
                },
                {
                    title: "Unificación de Lotes",
                    route: "unificacionlotes.index",
                    subroute: "/administrar-unificacion-lotes/",
                    icon: <TbPuzzle2 />,
                },

            ],
        },
        {
            title: "Auditoria",
            route: "audit.index",
            icon: <AiOutlineAudit />,
            roles: ["admin"],
        },
        {
            title: "Busqueda",
            route: "audit.index",
            icon: <AiOutlineAudit />,
            roles: ["admin"],
        },
    ];

    const tooltipStyle = {
        "--rt-color-dark": isDarkMode ? "#7c3aed" : "#db2a04",
        "--rt-color-white": "#fff",
        "--rt-color-success": isDarkMode ? "#7c3aed" : "#db2a04",
        "--rt-opacity": "0.8",
        "--rt-transition-show-delay": "0.20s",
        "--rt-transition-closing-delay": "0.20s",
        "--rt-tooltip-background": isDarkMode ? "#7c3aed" : "#db2a04",
        "--rt-tooltip-color": "#fff",
        "--rt-tooltip-padding": "10px 15px",
        "--rt-tooltip-border-radius": "30px",
        "--rt-tooltip-font-size": "12px",
    };


    return (
        <div className="flex min-h-screen bg-gray-200 dark:bg-gray-900">
            <SessionExpiredModal
                show={showSessionModal}
                closeModal={() => setShowSessionModal(false)}
            />
            <div className={`${open ? "w-80" : "w-28"} hidden sm:block min-h-screen bg-red-500 dark:bg-gray-800 border-e shadow-md dark:shadow-gray-600 border-gray-100 dark:border-gray-700 relative duration-300`}
            >
                <MdKeyboardArrowLeft
                    className={`absolute hover:bg-red-50 cursor-pointer -right-3 top-9 bg-white dark:bg-gray-800 text-3xl w-7 rounded-full ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                />
                <Link
                    href="/"
                    className={`flex items-center gap-x-4 py-3 px-4 h-16 ${!open && "justify-center"} cursor-pointer hover:bg-red-400 dark:hover:bg-gray-300 dark:hover:bg-opacity-5 rounded-sm group`}
                >
                    <ApplicationLogo
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
                    />
                    <h1
                        className={`text-white dark:text-white origin-left text-3xl ${!open && "duration-500 hidden"} truncate overflow-hidden whitespace-nowrap font-semibold pb-2`}
                    >
                        CAE-I
                    </h1>
                </Link>

                <ul className="pt-2">
                    {Menus.filter((item) =>
                        item.roles.some((role) => roles.includes(role))
                    ).map((Menu, index) => (
                        <li key={index} className="px-1">
                            {Menu.children ? (
                                <>

                                    <ButtonCustom
                                        active={showProjects}
                                        onClick={() => {
                                            if (!open) {
                                                setOpen(true);
                                                setTimeout(() => setShowProjects(true), 300);
                                            } else {
                                                setShowProjects(!showProjects);
                                            }
                                        }}
                                        className={`w-full ${!open && "justify-center"}`}
                                        data-tooltip-id={`tooltip-${index}`}
                                        data-tooltip-content={Menu.title}
                                        data-tooltip-place="right"
                                    >
                                        <span className="text-xl">{Menu.icon}</span>
                                        {open && (
                                            <span className="flex justify-between w-full items-center">
                                                <span>{Menu.title}</span>
                                                {showProjects ? <MdExpandLess /> : <MdExpandMore />}
                                            </span>
                                        )}
                                    </ButtonCustom>

                                    {!open && (
                                        <Tooltip
                                            id={`tooltip-${index}`}
                                            style={tooltipStyle}
                                        />
                                    )}
                                    {open && showProjects && ( // Solo muestra si la barra está abierta
                                        <ul className="ml-8">
                                            {Menu.children.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <LinkCustom
                                                        href={route(subItem.route)}
                                                        active={route().current(subItem.route)}
                                                        className="flex items-center p-2 hover:bg-red-400 rounded-sm gap-2"
                                                    >
                                                        <span className="text-xl">{subItem.icon}</span>
                                                        <span>{subItem.title}</span>
                                                    </LinkCustom>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <LinkCustom
                                    href={route(Menu.route)}
                                    active={
                                        Menu.subroute
                                            ? currentUrl.includes(Menu.subroute)
                                            : route().current(Menu.route)
                                    }
                                    className={`${!open && "justify-center"}`}
                                    data-tooltip-id={`tooltip-${index}`}
                                    data-tooltip-content={Menu.title}
                                    data-tooltip-place="right"
                                >
                                    <span className="text-xl">{Menu.icon}</span>
                                    <span
                                        className={`text-lg truncate overflow-hidden whitespace-nowrap ${!open && "duration-500 hidden"}`}
                                    >
                                        {Menu.title}
                                    </span>
                                </LinkCustom>
                            )}
                            {!open && (
                                <Tooltip
                                    id={`tooltip-${index}`}
                                    style={tooltipStyle}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full">
                <nav className="bg-white dark:bg-gray-800 border-b w-full">
                    <div className="flex justify-between h-16 px-4">
                        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="inline-flex items-center px-3 py-2 text-gray-500 dark:text-gray-400">
                                    {user.name} <MdKeyboardArrowLeft className="ml-2" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>Perfil</Dropdown.Link>
                                <Dropdown.Link href={route("logout")} method="post" as="button">
                                    Cerrar Sesión
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </nav>

                {header && <header className="bg-white shadow"><div className="py-6 px-5">{header}</div></header>}
                <main className="flex-grow py-3 px-5">{children}</main>
            </div>
        </div>
    );
};

export default Authenticated;
