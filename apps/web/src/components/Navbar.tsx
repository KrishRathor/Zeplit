import React from "react";

interface NavbarProps {
    height: number
}

export const Navbar: React.FC<NavbarProps> = (props) => {

    const { height } = props;

    return (
        <div style={{ background: '#0E1525', height: `${height}vh`, borderBottom: '2px solid white' }} className="" >
            
        </div>
    )
}