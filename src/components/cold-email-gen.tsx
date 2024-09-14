"use client";

import { useState } from "react";
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from "@google/generative-ai";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2, ClipboardCheck } from "lucide-react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

interface FormData {
  recipientName: string;
  recipientCompany: string;
  senderRole: string;
  emailPurpose: string;
  isLinkedIn: boolean;
}

export default function ColdEmailGenerator() {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [emailTemplate, setEmailTemplate] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLinkedIn, setIsLinkedIn] = useState<boolean>(false);

  const initializeChat = async (formData: FormData) => {
    setIsGenerating(true);
    const genAI = new GoogleGenerativeAI(
      "AIzaSyD_KgmKP1pc-Z6mtTIJQ3nZ_u0ckVSw1Pg"
    );
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Generate a personalized cold email template based on the user's input. The email should be professional, concise, and tailored to the recipient. Focus on creating a compelling opening, clearly stating the purpose, and including a strong call-to-action. If it's for LinkedIn, keep the message within 150 characters.",
    });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: formData.isLinkedIn ? 150 : 2048,
    };

    const session = model.startChat({
      generationConfig,
      history: [],
    });

    setChatSession(session);

    const prompt = `Generate a ${
      formData.isLinkedIn ? "LinkedIn message" : "cold email"
    } for ${formData.recipientName} at ${
      formData.recipientCompany
    }. The sender's role is ${
      formData.senderRole
    }, and the purpose of the email is ${formData.emailPurpose}.`;
    const result = await session.sendMessage(prompt);
    const response = await result.response;
    const generatedEmail = response.text();

    setEmailTemplate(generatedEmail);
    setIsGenerating(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: FormData = {
      recipientName: event.currentTarget.recipientName.value,
      recipientCompany: event.currentTarget.recipientCompany.value,
      senderRole: event.currentTarget.senderRole.value,
      emailPurpose: event.currentTarget.emailPurpose.value,
      isLinkedIn: isLinkedIn,
    };
    await initializeChat(formData);
  };

  return (
    <div className="w-full px-10 py-6">
      <Card className="mb-8 shadow-lg max-w-xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Cold Email Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="recipientName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Recipient Name
                </label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  placeholder="e.g. John Doe"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="recipientCompany"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Recipient Company
                </label>
                <Input
                  id="recipientCompany"
                  name="recipientCompany"
                  placeholder="e.g. Tech Innovations Inc."
                  required
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="senderRole"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Role
              </label>
              <Input
                id="senderRole"
                name="senderRole"
                placeholder="e.g. Sales Manager"
                required
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="emailPurpose"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Purpose
              </label>
              <Textarea
                id="emailPurpose"
                name="emailPurpose"
                placeholder="Describe the purpose of your email..."
                required
                className="w-full h-32"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="linkedin-mode"
                checked={isLinkedIn}
                onCheckedChange={setIsLinkedIn}
              />
              <Label htmlFor="linkedin-mode">LinkedIn Message Mode</Label>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={() => {
                setIsDialogOpen(false);
                setEmailTemplate("");
              }}
            >
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Cold Email"
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Generated {isLinkedIn ? "LinkedIn Message" : "Cold Email"}
                  </DialogTitle>
                </DialogHeader>
                <div className="bg-gray-50 p-4 rounded-md">
                  {emailTemplate &&
                    emailTemplate.split("\n").map((line, index) => (
                      <p key={index} className="my-2 text-gray-800">
                        {line}
                      </p>
                    ))}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(emailTemplate);
                    toast("Copied to clipboard", {
                      description:
                        "Email template has been copied successfully",
                      icon: (
                        <ClipboardCheck className="h-5 w-5 text-green-500" />
                      ),
                      action: {
                        label: "Dismiss",
                        onClick: () => toast.dismiss(),
                      },
                    });
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
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
