import React, { FC } from "react";
import { CardHeader } from "../ui/card";
import OpenSidebar from "./sidebar/openSidebar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type TitleCardProps = {
  title: string;
  href?: string;
  linkName?: string;
};

const TitleCard: FC<TitleCardProps> = ({ title, href, linkName }) => {
  const router = useRouter();
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex gap-2 text-2xl font-bold">
        <OpenSidebar />
        <h1>{title}</h1>
      </div>
      {href && <Button onClick={() => router.push(href)}>{linkName}</Button>}
    </CardHeader>
  );
};

export default TitleCard;
