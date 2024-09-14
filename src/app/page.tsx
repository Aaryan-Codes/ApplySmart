import ColdEmailGenerator from "@/components/cold-email-gen";
import CoverLetterGenerator from "@/components/cover-letter-gen";
import HeroSection from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center p-4">
        <HeroSection/>
        <div className="w-full px-10 py-6 grid grid-cols-[1fr_1fr] gap-4">
        <CoverLetterGenerator/>
        <ColdEmailGenerator/>
        </div>
        
      </div>
    </>
  );
}
