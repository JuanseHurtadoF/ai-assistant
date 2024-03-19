"use client";
import { Button } from "@/components/ui/general/button";
import { Input } from "@/components/ui/general/input";
import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "../../app/action";
import { CustomPieChart } from "../ui/charts/pieChart";

const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div>{inputValue}</div>,
      },
    ]);
    // Submit and get response message
    const responseMessage = await submitUserMessage(inputValue);
    setMessages((currentMessages) => [...currentMessages, responseMessage]);

    setInputValue("");
  };

 

  return (
    <div className="flex flex-col justify-between gap-4 flex-grow">
      <div className="flex flex-col items-start justify-start min-h-7 border border-slate-300 rounded-md flex-1 overflow-auto p-2">
        {
          // View messages in UI state
          messages.map((message) => (
            <div key={message.id}>{message.display}</div>
          ))
        }
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="How can I help you?"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
          />
          <Button type="submit" className="mt-2 w-full">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export { Chat };
