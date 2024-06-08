import React, { useState, useEffect, useContext } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { RiDashboard2Fill } from "react-icons/ri";
import LinkCustom from "@/Components/LinkCustom";
import { Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import ApplicationLogo from "@/Components/ApplicationLogo";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { IoPeopleCircle } from "react-icons/io5";
import DarkModeToggle from "@/Components/NightMode";
import { DarkModeContext } from "@/Components/DarkModeContext";

const Authenticated = ({
    user,
    header,
    children,
    roles = ["admin", "gerente"],
}) => {
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
            roles: ["admin"],
        },
        {
            title: "Customers",
            route: "clients",
            subroute: "/manage-customers/",
            icon: <IoPeopleCircle />,
            roles: ["admin", "gerente"],
        },
    ];

    return (
        <div className="flex min-h-screen  bg-gray-100 dark:bg-gray-900">
            <div
                className={` ${
                    open ? "w-48" : "w-20 "
                } hidden sm:block min-h-screen bg-white dark:bg-gray-800 border-e  shadow-md dark:shadow-gray-600 border-gray-100 dark:border-gray-700 relative duration-300`}
            >
                <MdKeyboardArrowLeft
                    className={`absolute hover:bg-green-50 cursor-pointer -right-3 top-9 bg-white dark:bg-gray-800 text-3xl w-7 text-gray-800 dark:text-gray-200 border-2 border-gray-900 dark:border-gray-200 rounded-full dark:hover:bg-gray-900 ${!open && "rotate-180 duration-300"}`}
                    onClick={() => setOpen(!open)}
                />
                <Link
                    href="/"
                    className={`flex items-center gap-x-4 py-3 px-4 h-16 ${!open && " justify-center"} cursor-pointer hover:bg-green-50 dark:hover:bg-green-500 dark:hover:bg-opacity-5 rounded-sm group`}
                >
                    <ApplicationLogo
                        className={`cursor-pointer duration-500 text-2xl text-gray-800 dark:text-gray-200 ${
                            open && "rotate-[360deg]"
                        }`}
                    />
                    <h1
                        className={`text-gray-800 dark:text-gray-200 origin-left text-2xl ${
                            !open && "duration-500 hidden"
                        } truncate overflow-hidden whitespace-nowrap`}
                    >
                        Digitell
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
                                        ? (Menu.subroute + route().current() === currentUrl && route().current())
                                        : route().current(Menu.route)
                                }
                                className={`${!open && "justify-center"}`}
                            >
                                <span className="text-lg">{Menu.icon}</span>
                                <span
                                    className={`text-lg truncate overflow-hidden whitespace-nowrap ${
                                        !open && "duration-500 hidden"
                                    }`}
                                >
                                    {Menu.title}
                                </span>
                            </LinkCustom>
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
                                        className={`flex gap-x-4 px-4  ${open ? "items-center" : "justify-center"} cursor-pointer`}
                                    >
                                        <ApplicationLogo
                                            className={`cursor-pointer duration-500   text-2xl text-gray-800 dark:text-gray-200 ${
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
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
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
                            {Menus.map((Menu, index) => (
                                <li key={index}>
                                    <ResponsiveNavLink
                                        href={route(Menu.route)}
                                        active={
                                            route().current(Menu.route) ||
                                            route().current(Menu.route + "/*")
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
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Log Out
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
