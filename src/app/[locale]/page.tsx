import { Fragment } from "react";
import Link from "next/link";

export default async function Home() {
  return (
    <Fragment>
      <Link className="text-3xl text-blue-700 underline" href="/en/info">
        Soft group info
      </Link>
    </Fragment>
  );
}
