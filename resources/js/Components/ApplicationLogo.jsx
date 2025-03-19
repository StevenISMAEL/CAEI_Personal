import React from 'react';

export default function AGLogo({ className, ...props }) {
  return (
    <img
      className={`w-15 h-12 ${className}`}
      {...props}
      src={"../images/logoArqui.png"}
      alt="Logo colegio arquitectos"
    />
  );
}