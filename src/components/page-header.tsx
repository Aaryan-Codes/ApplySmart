"use client"

import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { LuMountain } from "react-icons/lu";
import { Button } from "./ui/button";
import { IoSunnyOutline,IoMoonOutline } from "react-icons/io5";

const PageHeader = () => {

  const {setTheme} = useTheme();
  const [currentTheme,setCurrentTheme] = useState<string>("light");
  const handleThemeToggle = () =>{
    if(currentTheme === "light"){
      setTheme("dark");
      setCurrentTheme("dark");
    }else{
      setTheme("light");
      setCurrentTheme("light");
    }
  }
  return (
    <>
      <header className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-6 shadow-sm sm:px-6 lg:px-8">
        <Link href="#" className="flex items-center" prefetch={false}>
          <LuMountain className="h-6 w-6" />
          <span className="ml-2 text-xl font-semibold">ApplySmart</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button size={"icon"} onClick={handleThemeToggle} variant={"ghost"} className="hover:bg-transparent">
            {currentTheme === "light" ? <IoMoonOutline className="h-6 w-6" /> : <IoSunnyOutline className="h-6 w-6" />}
          </Button>
        </nav>
      </header>
    </>
  );
};

export default PageHeader;
