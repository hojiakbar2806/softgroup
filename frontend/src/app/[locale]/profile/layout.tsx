import Sidebar from "@/components/profile/sidebar/sidebar";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <div className="w-full flex-1 flex bg-blue-50">
      <Sidebar />
      {children}
    </div>
  );
}
