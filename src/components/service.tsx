"use client"

import React from "react";
import {ChevronUp, MonitorCog} from "lucide-react";

const services = [
    {
        image: MonitorCog,
        name: "Business Automation",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        image: MonitorCog,
        name: "App Development",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        image: MonitorCog, name: "Web Development",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        image: MonitorCog, name: "ML/AI",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        image: MonitorCog, name: "ERP/CRM",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        image: MonitorCog, name: "IoT",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
];

const Service = () => {
    const [active, setActive] = React.useState<number | null>();

    const toggleOpenCard = (index: number) => {
        if (active !== index) {
            setActive(index)
        } else setActive(null)
    }


    return (
        <div className="flex flex-col items-center gap-10">
            <h1 className="text-white text-4xl">Our Mission</h1>

            <div
                className="mx-auto shadow-white shadow p-10 max-w-4xl w-full flex flex-col gap-8 bg-white/5 rounded-2xl">
                {
                    services.map((item, index) => {
                        const open = active === index;
                        return (
                            <div data-active={open} key={index}
                                 className="w-full group animate-appear grid-cols-[1fr] grid grid-rows-[auto_0fr] gap-4 transition-all duration-300
                                data-[active=true]:grid-rows-[auto_1fr]"
                                 onClick={() => toggleOpenCard(index)}>
                                <div className="w-full flex border-b items-center justify-between cursor-pointer">
                                    <h1 className="text-white text-2xl transition-all duration-300">{item.name}</h1>
                                    <button className={`transition-all duration-300
                                group-data-[active=true]:rotate-180`
                                    }>
                                        <ChevronUp stroke="white" size={40}/>
                                    </button>
                                </div>

                                <p className="overflow-hidden text-white transition-all duration-300">{item.content}</p>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    );
};

export default Service;
