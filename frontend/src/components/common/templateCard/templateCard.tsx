import Image from "next/image";
import { FC } from "react";
import Rating from "../rating";

type TemplateCardProps = {
  template: any;
};

const TemplateCard: FC<TemplateCardProps> = () => {
  return (
    <div
      data-tooltipe="Trend"
      className="flex flex-col rounded-xl shadow-md bg-white relative
        hover:shadow-xl hover:scale-[1.02] transition-all duration-300
        after:content-[attr(data-tooltipe)] after:bg-red-500 after:absolute after:top-0 
        after:right-0 after:text-white after:px-3 after:py-px after:rounded-bl-xl after:rounded-tr-xl"
    >
      <Image
        src="/images/imgre.webp"
        width={340}
        height={200}
        alt={"template.template.title"}
        className="w-full bg-slate-400 rounded-t-2xl"
      />
      <div className="flex flex-col gap-3 p-4">
        <h1 className="font-semibold">Nikon - Bootstrap 5 Admin template</h1>
        <div className="flex justify-between items-center">
          <Rating value={3} readonly />
          <p className="flex gap-2 text-lg">
            <span className="text-red-500 line-through">16$</span>
            <span className="text-slate-400">free</span>
          </p>
        </div>
        <button
          className="w-full py-2 ring-2 rounded-lg ring-purple-500
          hover:bg-purple-500 hover:text-white transition"
        >
          Live Demo
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
