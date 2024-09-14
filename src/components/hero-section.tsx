"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const HeroSection = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    console.log(jobDescription);
    console.log(companyName);
    setJobDescription("");
    setCompanyName("");
  };

  return (
    <>
      <div className="p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Effortless Cover Letters, Emails, and Interview Prep
          </h1>
          <p className="text-muted-foreground text-lg">
            Create personalized job application materials in minutes.
          </p>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
