import React from "react";

const ComboBox = ({ options, value, onChange, ...props }) => {
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        if (onChange && typeof onChange === "function") {
            onChange(selectedValue);
        }
    };

    return (
        <select {...props} value={value} onChange={handleChange}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default ComboBox;
