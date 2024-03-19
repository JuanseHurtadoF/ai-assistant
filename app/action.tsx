import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import { FlightInfo } from "@/components/gen/flightInfo";
import { CustomPieChart } from "@/components/ui/charts/pieChart";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
  return <div>Loading...</div>;
}

// An example of a function that fetches flight information from an external API.
async function getFlightInfo(flightNumber: string) {
  return {
    flightNumber,
    departure: "New York",
    arrival: "San Francisco",
    status: "On time",
  };
}

async function getNewUsersByChannel() {
  return [
    { name: "Email", value: 240, fill: "#FF6384" }, //
    { name: "Organic", value: 456, fill: "#36A2EB" }, //
    { name: "Referral", value: 139, fill: "#FFCE56" }, //
    { name: "Social Media", value: 980, fill: "#9966FF" }, //
    { name: "Direct", value: 730, fill: "#FF9F40" }, //
  ];
}

async function submitUserMessage(userInput: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);

  // The `render()` creates a generated, streamable UI.
  const ui = render({
    model: "gpt-4-0125-preview",
    provider: openai,
    messages: [
      { role: "system", content: "You are a flight assistant" },
      { role: "user", content: userInput },
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return <p>{content}</p>;
    },
    tools: {
      get_flight_info: {
        description: "Get the information for a flight",
        parameters: z
          .object({
            flightNumber: z.string().describe("the number of the flight"),
          })
          .required(),
        render: async function* ({ flightNumber }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />;

          // Fetch the flight information from an external API.
          const flightInfo = await getFlightInfo(flightNumber);

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_flight_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(flightInfo),
            },
          ]);

          // Return the flight card to the client.
          return <FlightInfo flightInfo={flightInfo} />;
        },
      },
      get_users_channel: {
        description: "Get the numbers of new users by channel",
        parameters: z.object({}).required(),
        render: async function* () {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />;

          // Fetch the flight information from an external API.
          const data = await getNewUsersByChannel();

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_users_channel",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(data),
            },
          ]);

          // Return the flight card to the client.
          return <CustomPieChart data={data} />;
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});
