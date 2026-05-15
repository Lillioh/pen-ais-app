const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const text = body.text || "";
    const action = body.action || "refine";

    let instruction = "";

    switch (action) {
      case "refine":
        instruction =
          "Refine this writing professionally while preserving meaning.";
        break;

      case "expand":
        instruction =
          "Expand this writing with more depth and detail.";
        break;

      case "summarize":
        instruction =
          "Summarize this writing clearly and concisely.";
        break;

      case "grammar":
        instruction =
          "Fix grammar, spelling, punctuation, and sentence structure.";
        break;

      case "tone":
        instruction =
          "Rewrite this in a futuristic sophisticated tone.";
        break;

      default:
        instruction =
          "Improve this writing professionally.";
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");

    if (!groqKey) {
      throw new Error("Missing GROQ_API_KEY");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },

        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content:
                "You are an advanced AI writing assistant.",
            },

            {
              role: "user",
              content: `${instruction}\n\n${text}`,
            },
          ],

          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify(data),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        output: data.choices[0].message.content,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});