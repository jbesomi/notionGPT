import { getToken } from "next-auth/jwt";

import AuthButton from "../components/AuthButton";
import { useEffect, useState } from "react";
import Link from "next/link";

import { getPages, Page } from "../lib/notion";
import { Configuration, OpenAIApi } from "openai";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import Container from "../components/Container";

interface Props {
  pages: Page[];
}

function Processing() {
  return (
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md transition ease-in-out duration-150 cursor-not-allowed"
    >
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p>
        Processing this takes about 5/10 seconds depending on the length ...
      </p>
    </button>
  );
}

function NotionContent({ pages, selectedContent, setSelectedContent }) {
  const handleCheckboxChange = (page: Page) => {
    setSelectedContent((prev) => {
      return prev.includes(page)
        ? prev.filter((p) => p.id !== page.id)
        : [...prev, page];
    });
  };

  return (
    <>
      <div className="my-4">
        <p className="text-xl font-semibold">My Notion Documents</p>
        <p className="ml-1">
          Select the Notion Documents to send to ChatGPT as context.
        </p>
      </div>
      <ul className="list-none">
        {pages.map((page) => (
          <li key={page.id} className="mb-2">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => handleCheckboxChange(page)}
            />
            <Link href={`/content/${page.id}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function APIKey({ apiKey, setApiKey }) {
  return (
    <div className="flex my-6 items-center">
      <div className="w-min-max">
        <label htmlFor="apiKey" className=" mr-2">
          OpenAI API Key
        </label>
      </div>
      <div className="">
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
}

function PromptAnswer({ prompt, setPrompt, apiKey, selectedContent }) {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cost, setCost] = useState(0);
  const [input, setInput] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  useEffect(() => {
    const compute = async () => {
      const content = selectedContent.map((page) => page.content).join("\n");
      const input = `Context: \n\n---\n${content}\n---\n\nYour task: \n\n${prompt}\n`;
      setInput(input);

      const response = await fetch("/api/counter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
      const { tokenCount } = await response.json();

      const cost = (tokenCount / 1000) * 0.002;
      setCost(cost);
    };

    compute();
  }, [selectedContent, prompt]);

  const compute = async () => {
    setIsLoading(true);
    const configuration = new Configuration({
      apiKey: apiKey,
    });

    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }],
    });
    const a = completion.data.choices[0].message.content;
    setAnswer(a);
    setIsLoading(false);
  };

  return (
    <div>
      {false && (
        <p className="text-right my-2">{cost.toFixed(6)} $ per execution</p>
      )}

      <div className="flex">
        <textarea
          id="prompt"
          value={prompt}
          onChange={handlePromptChange}
          className="w-full h-24 p-2 border border-gray-300 rounded-xl"
        />

        <button onClick={compute} className="border p-2 m-2">
          Send
        </button>
      </div>

      {isLoading ? (
        <div className="mt-4">
          <Processing />
        </div>
      ) : (
        answer && (
          <div className="mt-4">
            <div className="p-4 bg-gray-100 rounded prose">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default function Pages({ pages }: Props) {
  const { data: session, status } = useSession();

  const [selectedContent, setSelectedContent] = useState<Page[]>([]);
  const [prompt, setPrompt] = useState("Prompt ...");

  const [displayContent, setDisplayContent] = useState(false);

  const [apiKey, setApiKey] = useState("");

  const toggleDisplayContent = () => {
    setDisplayContent(!displayContent);
  };

  return (
    <Container title="notionGPT">
      <div className="flex justify-center">
        <AuthButton />
      </div>
      {session && (
        <>
          <APIKey apiKey={apiKey} setApiKey={setApiKey} />

          <div className="border my-10" />

          <NotionContent
            pages={pages}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
          />

          <div className="border my-10" />

          <PromptAnswer
            prompt={prompt}
            setPrompt={setPrompt}
            apiKey={apiKey}
            selectedContent={selectedContent}
          />
        </>
      )}
    </Container>
  );
}

export async function getServerSideProps({ req }) {
  const token = await getToken({
    req,
    encryption: true,
  });

  let pages = [];
  if (token) {
    pages = await getPages(token.accessToken);
  }

  return { props: { pages: pages } };
}
