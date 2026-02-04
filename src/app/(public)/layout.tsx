import GlobalNavbar from "@/components/GlobalNavbar";
import { FooterSection } from "@/components/landing";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalNavbar />
      {children}
      <FooterSection />
    </>
  );
}
