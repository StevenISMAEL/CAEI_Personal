import React from "react";

const Checkbox = ({ id, name, label, checked, onChange }) => {
    return (
        <div className="flex items-center mt-4 mb-0 ">
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                className="mr-2 rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
            />
            <label htmlFor={id} className="text-sm text-gray-700 dark:text-gray-300">
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
