export default function ThirdButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-sky-500 dark:bg-sky-300 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-sky-600 dark:hover:bg-sky-400 focus:bg-slate-600 dark:focus:bg-sky-400 active:bg-sky-700 dark:active:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2 dark:focus:ring-offset-sky-800 transition ease-in-out duration-150 ${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
