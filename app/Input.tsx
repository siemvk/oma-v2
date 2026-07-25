import type { InputProps } from "@siemsiem/beerreact";
import React from "react";


export const Input = ({
    size,
    children,
    output,
    invalid,
    label,
    iconPrefix,
    iconSuffix,
    border,
    round,
    fill,
    ...props
}: InputProps) => {
    if (border == undefined) {
        border = true
    }
    return <div
        className={`field 
            ${border ? "border" : ""}
            ${round ? "left-round" : ""}
            ${fill ? "fill" : ""}
            ${size || ""}
            ${invalid ? "invalid" : ""} 
            ${label !== undefined && label !== "" ? "label" : ""}
            ${iconPrefix ? "prefix" : ""}
            ${iconSuffix ? "suffix" : ""}`}
    >
        {iconPrefix && <i>{iconPrefix}</i>}
        <input type="text" {...props} />
        {label && <label>{label}</label>}
        {output && <output className={invalid ? "invalid" : ""}>{output}</output>}
        {iconSuffix && <i>{iconSuffix}</i>}

    </div>
};

export default Input;