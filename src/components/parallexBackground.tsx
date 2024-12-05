import React from "react";

export const ParallexBackground: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-parallex pointer-events-none z-[-1]">
            <div id="stars1" className="rounded-full"></div>
            <div id="stars2" className="rounded-full"></div>
            <div id="stars3" className="rounded-full"></div>
        </div>
    )
}