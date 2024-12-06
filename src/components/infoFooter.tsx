import React from "react";
import Link from "next/link";
import {Facebook, Instagram, Linkedin, Send} from "lucide-react";

export const InfoFooter = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <span className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent"></span>

            <div className="flex gap-5 p-4">
                <Link href={""} data-tooltipe="Instagram"
                      className="
                       transition-all duration-300 relative
                       before:absolute before:content-[attr(data-tooltipe)] hover:before:top-[-110%] before:bg-white before:py-1 before:px-2 before:text-sm before:rounded-md before:left-1/2 before:translate-x-[-50%] before:z-10 before:rotate-12 before:-top-1/2 before:opacity-0

                       "
                >
                    <Instagram stroke={"white"} size={20}/>
                </Link>
                <Link href={""}>
                    <Linkedin stroke={"white"} size={20}/>
                </Link>
                <Link href={""}>
                    <Facebook stroke={"white"} size={20}/>
                </Link>
                <Link href={""}>
                    <Send stroke={"white"} size={20}/>
                </Link>
            </div>
        </div>
    )
}