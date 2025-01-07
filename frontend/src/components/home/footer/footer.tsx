import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="flex border-t justify-center items-center py-8 mt-auto bg-white text-gray-700">
      <div className="container w-full flex flex-col items-center">
        <div className="flex space-x-6 mb-4">
          <Link
            target="_blank"
            href="https://www.facebook.com/softgroupuz/"
            className="hover:text-purple-500 transition duration-300"
          >
            <FacebookIcon size={28} />
          </Link>
          <Link
            target="_blank"
            href="https://www.instagram.com/uz_digit/profilecard/?igsh=MTk2NGxlcWx6YmF3eA=="
            className="hover:text-purple-500 transition duration-300"
          >
            <InstagramIcon size={28} />
          </Link>
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/soft-group-81b30433a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            className="hover:text-purple-500 transition duration-300"
          >
            <LinkedinIcon size={28} />
          </Link>
          <Link
            target="_blank"
            href="https://t.me/+NPLkASilimo1NzVi"
            className="hover:text-purple-500 transition duration-300"
          >
            <SendIcon size={28} />
          </Link>
        </div>

        <p className="text-sm sm:text-base lg:text-lg text-gray-600 transition duration-300">
          Copyright ©2024 - 2025 Softgroup
        </p>
      </div>
    </footer>
  );
};

export default Footer;
