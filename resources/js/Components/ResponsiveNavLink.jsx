import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
                active
                    ? 'border-gray-400 dark:border-gray-600 text-black dark:text-black bg-neutral-100 dark:bg-neutral-100 focus:text-black dark:focus:text-neutral-100 focus:bg-neutral-100 dark:focus:bg-neutral-100 focus:border-gray-700 dark:focus:border-gray-300'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 hover:bg-neutral-100 dark:hover:bg-neutral-100 hover:border-gray-300 dark:hover:border-gray-600 focus:text-gray-800 dark:focus:text-gray-800 focus:bg-neutral-100 dark:focus:bg-neutral-100 focus:border-gray-300 dark:focus:border-gray-600'
            } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
