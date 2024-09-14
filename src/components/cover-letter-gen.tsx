"use client";

import { useState } from "react";
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from "@google/generative-ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface FormData {
  jobDescription: string;
  role: string;
  companyName: string;
}

export default function CoverLetterGenerator() {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const initializeChat = async (formData: FormData) => {
    setIsGenerating(true);
    const genAI = new GoogleGenerativeAI(
      "AIzaSyD_KgmKP1pc-Z6mtTIJQ3nZ_u0ckVSw1Pg"
    );
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Generate a personalized cover letter based on the user's input, which will include the job description, the role they are applying for, and the name of the company. Use the details provided from the job description to tailor the cover letter, ensuring that the content highlights relevant skills, experiences, and qualifications that align with the job requirements. Mention the company name to make the letter more personalized. Focus on making the cover letter impactful, professional, and concise, while emphasizing the applicant's fit for the role and their enthusiasm for the opportunity.",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const session = model.startChat({
      generationConfig,
      history: [],
    });

    setChatSession(session);

    const prompt = `Generate a cover letter for a ${formData.role} position at ${formData.companyName}. Job description: ${formData.jobDescription}`;
    const result = await session.sendMessage(prompt);
    const response = await result.response;
    const generatedCoverLetter = response.text();

    setCoverLetter(generatedCoverLetter);
    setIsGenerating(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: FormData = {
      jobDescription: event.currentTarget.jobDescription?.value || '',
      role: event.currentTarget.role?.value || '',
      companyName: event.currentTarget.companyName?.value || '',
    };
    await initializeChat(formData);
  };
  

  return (
    <div className="w-full px-10 py-6">
      <Card className="mb-8 shadow-lg max-w-xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Cover Letter Generator</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Input id="role" type="text" name="role" placeholder="e.g. Software Engineer" required className="w-full" />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <Input id="companyName" type="text" name="companyName" placeholder="e.g. Tech Innovations Inc." required className="w-full" />
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <Textarea id="jobDescription" name="jobDescription" placeholder="Paste the job description here..." required className="w-full h-32" />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={()=>{
              setIsDialogOpen(false);
              setCoverLetter("");
            }}>
              <DialogTrigger asChild>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Cover Letter"
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Generated Cover Letter</DialogTitle>
                </DialogHeader>
                <div className="bg-gray-50 p-4 rounded-md">
                  {coverLetter && coverLetter.split("\n").map((line, index) => (
                    <p key={index} className="my-2 text-gray-800">
                      {line}
                    </p>
                  ))}
                </div>
                <Button onClick={() => {
                  navigator.clipboard.writeText(coverLetter);
                  toast("Copied to clipboard", {
                    description: "Cover letter has been copied successfully",
                    icon: <ClipboardCheck className="h-5 w-5 text-green-500" />,
                    action: {
                      label: "Dismiss",
                      onClick: () => toast.dismiss(),
                    },
                  })
                }} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Copy to Clipboard
                </Button>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
