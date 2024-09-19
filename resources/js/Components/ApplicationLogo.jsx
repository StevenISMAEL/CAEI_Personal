import React from "react";

export default function AGLogo({ className, ...props }) {
    return (
        <svg
            className={`w-24 h-12 ${className}`}
            {...props}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 240 120"
            preserveAspectRatio="xMidYMid meet"
            xmlSpace="preserve"
        >
            <g>
                {/* Letter A */}
                <path
                    fill="#581c87"
                    d="M20,100 L40,20 L60,20 L80,100 H65 L61,85 H39 L35,100 H20 Z M42,70 H58 L50,40 L42,70 Z"
                />
                <linearGradient
                    id="SVGID_1_"
                    gradientUnits="userSpaceOnUse"
                    x1="20"
                    y1="60"
                    x2="80"
                    y2="60"
                >
                    <stop offset="0" stopColor="#9333ea" />
                    <stop offset="0.4409" stopColor="#9333ea" stopOpacity="0.8005" />
                    <stop offset="1" stopColor="#9333ea" stopOpacity="0.3" />
                </linearGradient>
                <path
                    fill="url(#SVGID_1_)"
                    d="M20,100 L40,20 L60,20 L80,100 H65 L61,85 H39 L35,100 H20 Z M42,70 H58 L50,40 L42,70 Z"
                />
                
                {/* Letter G */}
                <path
                    fill="#149765"
                    d="M220,60 C220,36.804 201.196,18 178,18 C154.804,18 136,36.804 136,60 C136,83.196 154.804,102 178,102 C191.255,102 203.039,96.157 211,86.941 V102 H190 V85 H220 V60 Z M178,85 C164.745,85 154,74.255 154,61 C154,47.745 164.745,37 178,37 C191.255,37 202,47.745 202,61 C202,74.255 191.255,85 178,85 Z"
                />
                <path
                    fill="#42AC5B"
                    d="M220,60 C220,36.804 201.196,18 178,18 C154.804,18 136,36.804 136,60 C136,83.196 154.804,102 178,102 C191.255,102 203.039,96.157 211,86.941 V102 H190 V85 H220 V60 Z M178,85 C164.745,85 154,74.255 154,61 C154,47.745 164.745,37 178,37 C191.255,37 202,47.745 202,61 C202,74.255 191.255,85 178,85 Z"
                />
            </g>
        </svg>
    );
}