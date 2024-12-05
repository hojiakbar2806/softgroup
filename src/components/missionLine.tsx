import React from "react";

const mission = [
    {
        id: 1,
        name: "Mission Line",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        id: 2,
        name: "Mission Line",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        id: 3,
        name: "Mission Line",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        id: 4,
        name: "Mission Line",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        id: 5,
        name: "Mission Line",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        id: 6,
        name: "Mission Line",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        id: 7,
        name: "Mission Line",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
];

export const MissionLine: React.FC = () => {
    return (
        <div className="p-0 md:px-20 flex flex-col items-center gap-10">
            <h1 className="text-white text-4xl">Our Mission</h1>
            <div
                className="space-y-5 relative before:absolute  before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">

                {
                    mission.map((item) => {
                        return (
                            <div key={item.id}
                                 className="animate-appear  relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div
                                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-parallex  text-slate-500  shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <h1 className="text-2xl text-white">{item.id}</h1>
                                </div>
                                <div
                                    className="w-[calc(100%-4rem)] bg-white/5 md:w-[calc(50%-2.5rem)] p-4 rounded-xl  shadow shadow-white">
                                    <div className="flex items-center justify-between space-x-3 mb-1">
                                        <h1 className="font-bold text-2xl text-white">{item.name}</h1>
                                        {/*<time className="font-caveat font-medium text-indigo-500">08/06/2023</time>*/}
                                    </div>
                                    <div className="text-white">{item.content}</div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    );
};
