import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { age, gender, weight, height, foodPreference, fileName, fileBase64, fileMimeType } = await req.json();

    const systemPrompt = `You are a medical AI assistant that analyzes blood report data. You MUST respond with valid JSON only, no markdown, no code blocks.

Return this exact JSON structure:
{
  "summary": "A 2-3 sentence summary of the blood report findings mentioning specific values extracted from the report",
  "risks": [
    {"label": "Risk name", "severity": "high|moderate|low", "confidence": 75}
  ],
  "diet": {
    "veg": [
      {"meal": "Breakfast", "items": "specific food recommendations"},
      {"meal": "Mid-Morning", "items": "..."},
      {"meal": "Lunch", "items": "..."},
      {"meal": "Snack", "items": "..."},
      {"meal": "Dinner", "items": "..."}
    ],
    "nonVeg": [
      {"meal": "Breakfast", "items": "..."},
      {"meal": "Mid-Morning", "items": "..."},
      {"meal": "Lunch", "items": "..."},
      {"meal": "Snack", "items": "..."},
      {"meal": "Dinner", "items": "..."}
    ]
  }
}

Extract ACTUAL values from the blood report image/document. Mention specific test names and their values in the summary. Identify risks based on actual out-of-range values. Include 3-5 risks with realistic confidence scores (60-95). Tailor diet plans to Indian cuisine. Consider the patient's age, gender, BMI, and food preference.`;

    const userTextPrompt = `Analyze this blood report for a patient with these details:
- Age: ${age} years
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm
- Food Preference: ${foodPreference}
- Report File: ${fileName}

Extract actual blood test values from the attached report. Identify abnormal values, health risks, and provide personalized diet plans.

Return ONLY valid JSON, no other text.`;

    // Build multimodal message with the file
    const userContent: any[] = [{ type: "text", text: userTextPrompt }];

    if (fileBase64 && fileMimeType) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${fileMimeType};base64,${fileBase64}`,
        },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Clean potential markdown code blocks
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
