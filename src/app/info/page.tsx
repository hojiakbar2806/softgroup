import {ParallexBackground} from "@/components/parallexBackground";
import {MissionLine} from "@/components/missionLine";
import {Header} from "@/components/header";
import Service from "@/components/service";

export default function InfoPage() {
    return (
        <div className="w-full flex flex-col gap-10 z-10 p-2">
            <Header/>
            <MissionLine/>
            <Service/>
            <ParallexBackground/>
        </div>
    )
}