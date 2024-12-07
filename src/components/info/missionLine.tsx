import React from "react";

const mission = [
  {
    id: 1,
    name: "Innovatsion yechimlar yaratish.",
    content:
      "Har bir mahsulotimiz orqali mijozlarimiz uchun innovatsion va samarali yechimlar taqdim etishni maqsad qilamiz.",
  },
  {
    id: 2,
    name: "Mijozlarimizning Ustuvorligi.",
    content:
      "Bizning asosiy e'tiborimiz — faoliyatimiz. Ularning bizneslarini rivojlantirishga yordam, samarali va foydalanuvchi dasturlarni ishga tushirish orqali ularga maksimal quvvat berish imkonini beradi.Biz taqdim etadigan barcha ta'minot vositalarining yuqori sifati va ishonchliligiga kafolat beramiz.",
  },
  {
    id: 3,
    name: "Raqobatbardoshlik va Boshqaruv Efektivligi.",
    content:
      "Resurslarni optimallashtirish va tezkor qarorlar qabul qilish orqali jarayonlarning samaradorligini oshiramiz.Sifatli mahsulotlar va innovatsion texnologiyalar orqali bozor talablarini to'la qondira olamiz.",
  },
  {
    id: 4,
    name: "Mahalliy Bozorga Moslashuvchanlik.",
    content:
      "O'zbekistonda sanoat rivojini qo'llab-quvvatlash va mahalliy tadbirkorlikni kuchaytirishga hissa qo'shamiz.",
  },
  {
    id: 5,
    name: "Uzoq Muddatli Hamkorlikni Rivojlantirish.",
    content:
      "Biz milliy qisqa, balki uzoq muddatli va manfaatli yordamni rivojlantirishga intilamiz. Mijozlarimiz bilan mustahkam ishonchga hamkorlikni yo'lga qo'yish, doimiy doimiy qo'llab-quvvatlash va maslahatlar taqdim etish bizning strategiyamizning asosidir.",
  },
  {
    id: 6,
    name: "Jamoa va Kadrlar Taraqqiyoti.",
    content:
      "Bizning muvaffaqiyatimiz — malakali va fidoyilarga ega bo'lgan jamoamizning yordamga bog'liq. Biz o'zimizni doimiy ravishda rivojlantirib boramiz, ularga eng yaxshi sharoitlarni yaratamiz va qobiliyatli o'z ustida ishlaydigan kelajak avlodga ham ish o'rinlari yarata olamiz.",
  },
];

export const MissionLine: React.FC = () => {
  return (
    <div className=" flex flex-col items-center gap-10">
      <h1 className="font-bold text-white text-2xl md:text-3xl xl:text-4xl 2xl:text-5x">
        Bizning vazifalarimiz
      </h1>
      <div className="space-y-5 relative before:absolute max-w-7xl before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {mission.map((item) => {
          return (
            <div
              key={item.id}
              className="animate-appear  relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-nightSkyRadial  text-slate-500  shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <h1 className="text-md lg:text-2xl text-white">{item.id}</h1>
              </div>
              <div className="w-[calc(100%-4rem)] bg-white/5 md:w-[calc(50%-2.5rem)] p-4 md:p-6 rounded-xl  shadow shadow-white">
                <div className="flex items-center justify-between space-x-3 mb-1 md:mb-4">
                  <h1 className="font-semibold text-white text-xl md:text-2xl xl:text-3xl">
                    {item.name}
                  </h1>
                </div>
                <p className="text-white text-sm md:text-base lg:text-lg xl:text-xl">
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
