"use client";
import { getDictionary } from "@/features/localization/getDictionary";
import { closeModal } from "@/features/modal/loginMessageModalSlice";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

type LoginMessageModalProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

const LoginMessageModal: FC<LoginMessageModalProps> = ({ dictionary }) => {
  const dispatch = useDispatch();
  const dict = dictionary.Common.modal;
  const { isOpen, message, path, button } = useSelector(
    (state: RootState) => state.loginModal
  );
  const router = useRouter();

  const handleCancel = () => {
    dispatch(closeModal());
    router.push("/");
  };

  const handleClick = () => {
    router.push(path);
    dispatch(closeModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{dict.message}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex items-center justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg bg-purple-50 text-gray-700 hover:bg-purple-200 transition"
          >
            {dict.cancel}
          </button>
          <button
            onClick={handleClick}
            className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
          >
            {button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginMessageModal;
