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
                "flex gap-x-3 px-3 py-1 mt-1 h-10 items-center font-light rounded-e-md border-s-2 transition duration-150 ease-in-out hover:bg-neutral-100 hover:border-gray-500 dark:hover:border-gray-500 focus:text-gray-600 " +
                (active ? "bg-neutral-100 bg-opacity-100 border-gray-700 dark:border-gray-600 text-black focus:border-white " : "text-white border-transparent dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-900 focus:text-gray-700 focus:border-gray-300 dark:focus:border-gray-700 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
