import React from "react"
import {PhoneOutgoing} from "lucide-react";

export const Header: React.FC = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-10 p-20 max-w-5xl mx-auto text-white">
            <h1 className="text-7xl"><span className="font-extrabold text-purple-800">Soft</span>Group</h1>
            <p className="max-w-2xl leading-[150%] text-center font-semibold text-md md:text-xl">
                Sizning IT sohasidagi ehtiyojlaringiz uchun ishonchli hamkor! Shuningdek, biz sayt shablonlarini ishlab
                chiqish va tayyorlash bo‘yicha buyurtmalarni
                qabul qilamiz. Mijozlarimiz o‘z veb-saytlarini sotish imkoniyatiga ega bo‘lishlari uchun barcha zarur
                xizmatlarni taqdim etamiz. Biz bilan birgalikda biznesingizni global bozorda yuksaltirish osonroq!
            </p>
            <a className="flex items-center gap-4 py-3 px-6 md:py-4 md:px-10 text-lg border border-transparent md:text-2xl bg-purple-800 rounded-full
                hover:bg-purple-500 hover:border-white duration-300 transition-all"
               href="tel:+998773067067">Contact us
                <PhoneOutgoing/></a>
        </div>
    )
}