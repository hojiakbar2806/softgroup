import { FC } from "react";

type TemplateCardWrapperProps = {
  children: React.ReactNode;
};

const TemplateCardWrapper: FC<TemplateCardWrapperProps> = ({ children }) => {
  return (
    <div className="w-full h-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  );
};

export default TemplateCardWrapper;
