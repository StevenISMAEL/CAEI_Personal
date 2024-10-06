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

const Authenticated = ({ user, header, children, roles = ["admin"] }) => {
    const { env } = usePage().props;
    const { sessionActive } = useSessionChecker(env.SESSION_LIFETIME);
    const [showSessionModal, setShowSessionModal] = useState(false);

    const { flash } = usePage().props;
    const notify = useNotify();
    const [message, setMessage] = useState(flash.message);
    const [messageType, setMessageType] = useState(flash.type);

    useEffect(() => {
        if (message) {
            notify(messageType, message, { autoClose: 5000 });
            setMessage(null);
            setMessageType(null);
        }
    }, [message, messageType]);

    useEffect(() => {
        if (flash.message) {
            setMessage(flash.message);
            setMessageType(flash.type);
        }
    }, [flash]);

    useEffect(() => {
        if (!sessionActive) {
            setShowSessionModal(true);
        }
    }, [sessionActive]);

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
            title: "Planos Arquitectónicos",
            route: "planoarq.index",
            subroute: "/administrar-planosarq/",
            icon: <FaFileContract />,
            roles: ["admin", "arquitectorevisor"],
        },
        {
            title: "Fraccionamientos",
            route: "fraccionamiento.index",
            subroute: "/administrar-fraccionamiento/",
            icon: <TbMapStar />,
            roles: ["admin", "arquitectorevisor"],
        },
        {
            title: "Trabajos Varios",
            route: "trabajosvar.index",
            subroute: "/administrar-Trabajov/",
            icon: <HiMiniClipboardDocumentList />,
            roles: ["admin", "arquitectorevisor"],
        },
        {
            title: "Propiedad Horizontal",
            route: "propiedadh.index",
            subroute: "/administrar-propiedadh/",
            icon: <TbMapShare />,
            roles: ["admin", "arquitectorevisor"],
        },
        {
            title: "Aforos",
            route: "aforos.index",
            subroute: "/administrar-aforos/",
            icon: <FaPeopleGroup />,
            roles: ["admin", "arquitectorevisor"],
        },
        {
            title: "Unificación Lotes",
            route: "unificacionlotes.index",
            subroute: "/administrar-unificaciones/",
            icon: <TbPuzzle2 />,
            roles: ["admin", "arquitectorevisor"],
        },
        {
            title: "Auditoria",
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
        <div className="flex min-h-screen  bg-gray-200 dark:bg-gray-900">
            <SessionExpiredModal
                show={showSessionModal}
                closeModal={() => setShowSessionModal(false)}
            />
            <div
                className={` ${
                    open ? "w-80" : "w-28 "
                } hidden sm:block min-h-screen bg-red-500 dark:bg-gray-800 border-e  shadow-md dark:shadow-gray-600 border-gray-100 dark:border-gray-700 relative duration-300`}
            >
                <MdKeyboardArrowLeft
                    className={`absolute hover:bg-red-50 cursor-pointer -right-3 top-9 bg-white dark:bg-gray-800 text-3xl w-7 text-gray-800 dark:text-gray-200 border-2 border-gray-900 dark:border-gray-200 rounded-full dark:hover:bg-gray-900 ${!open && "rotate-180 duration-300"}`}
                    onClick={() => setOpen(!open)}
                />
                <Link
                    href="/"
                    className={`flex items-center gap-x-4 py-3 px-4 h-16 ${!open && " justify-center"} cursor-pointer hover:bg-red-400 dark:hover:bg-gray-300 dark:hover:bg-opacity-5 rounded-sm group`}
                >
                  
                    {
                        <ApplicationLogo
                            className={`cursor-pointer duration-500 ${
                                open && "rotate-[360deg]"
                            }`}
                        />
                    }
                    <h1
                        className={`text-gray-200 dark:text-gray-200 origin-left text-3xl ${
                            !open && "duration-500 hidden"
                        } truncate overflow-hidden whitespace-nowrap font-semibold pb-2`}
                    >
                        CAE-I
                    </h1>
                </Link>

                <ul className="pt-2">
                    {Menus.filter((item) =>
                        item.roles.some((role) => roles.includes(role)),
                    ).map((Menu, index) => (
                        <li key={index} className="px-1">
                            <LinkCustom
                                href={route(Menu.route)}
                                active={
                                    Menu.subroute
                                        ? Menu.subroute + route().current() ===
                                          currentUrl + ".index"
                                        : route().current(Menu.route)
                                }
                                className={`${!open && "justify-center"}`}
                                data-tooltip-id={`tooltip-${index}`}
                                data-tooltip-content={Menu.title}
                                data-tooltip-place="right"
                            >
                                <span className="text-xl">{Menu.icon}</span>
                                <span
                                    className={`text-lg truncate overflow-hidden whitespace-nowrap ${
                                        !open && "duration-500 hidden"
                                    }`}
                                >
                                    {Menu.title}
                                </span>
                            </LinkCustom>
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
            <div className="flex flex-col w-full">
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 w-full ">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between sm:justify-end h-16">
                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => {
                                                setOpen(!open);
                                                return !previousState;
                                            },
                                        )
                                    }
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex sm:hidden">
                                <DarkModeToggle
                                    isDarkMode={isDarkMode}
                                    toggleDarkMode={toggleDarkMode}
                                />
                                <div className="shrink-0 flex items-center">
                                    <Link
                                        href="/"
                                        className={`flex gap-x-4 py-3 px-4 h-16 ${open ? "items-center" : "justify-center"} cursor-pointer`}
                                    >
                                        <ApplicationLogo
                                            className={`cursor-pointer duration-500 ${
                                                open && "rotate-[360deg]"
                                            }`}
                                        />
                                    </Link>
                                </div>
                            </div>

                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <DarkModeToggle
                                    isDarkMode={isDarkMode}
                                    toggleDarkMode={toggleDarkMode}
                                />
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content width="36">
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Perfil
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Cerrar Sesión
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? "block" : "hidden") +
                            " sm:hidden"
                        }
                    >
                        <ul className="pt-2 pb-3 space-y-1">
                            {Menus.filter((item) =>
                                item.roles.some((role) => roles.includes(role)),
                            ).map((Menu, index) => (
                                <li key={index}>
                                    <ResponsiveNavLink
                                        href={route(Menu.route)}
                                        active={
                                            Menu.subroute
                                                ? Menu.subroute +
                                                      route().current() ===
                                                  currentUrl + ".index"
                                                : route().current(Menu.route)
                                        }
                                    >
                                        {Menu.title}
                                    </ResponsiveNavLink>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Perfil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Cerrar Sesión
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>
                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="max-w-8xl mx-auto py-6 px-5 sm:px-10 lg:px-14">
                            {header}
                        </div>
                    </header>
                )}
                <main className="flex-grow py-3 px-5">{children}</main>
            </div>
        </div>
    );
};
export default Authenticated;
