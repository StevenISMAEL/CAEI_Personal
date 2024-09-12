import { Link } from "@inertiajs/react";

export default function LinkCustom({
    active = false,
    className = "",
    open = true,
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "flex gap-x-3 px-3 py-1 mt-1 h-10 items-center font-light rounded-e-md border-s-2 transition duration-150 ease-in-out hover:bg-blue-300 hover:border-blue-500 dark:hover:border-blue-500 focus:text-gray-600 " +
                (active ? "bg-blue-300 bg-opacity-100 border-blue-700 dark:border-blue-600 text-gray-900 focus:border-blue-900 " : "text-gray-500 border-transparent dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 focus:text-gray-700 focus:border-gray-300 dark:focus:border-gray-700 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
