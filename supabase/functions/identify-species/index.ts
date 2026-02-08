import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, speciesName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert biologist and taxonomist AI. Your task is to identify species from images or names and provide comprehensive biological information.

When given an image or species name, respond with a detailed JSON object containing:
{
  "commonName": "Common name of the species",
  "scientificName": "Scientific binomial name",
  "taxonomy": {
    "kingdom": "Kingdom name",
    "phylum": "Phylum name",
    "class": "Class name",
    "order": "Order name",
    "family": "Family name",
    "genus": "Genus name",
    "species": "Species epithet"
  },
  "habitat": "Detailed description of natural habitat and geographic distribution",
  "diet": "Diet information (or 'N/A - Photosynthesis' for plants, 'N/A - Saprotrophic' for fungi)",
  "behavior": "Behavioral characteristics, life cycle, or growth patterns",
  "conservationStatus": "IUCN conservation status (e.g., Least Concern, Vulnerable, Endangered, Critically Endangered)",
  "evolution": "Evolutionary history and closest relatives",
  "physicalCharacteristics": "Size, weight, distinctive features, coloration",
  "reproduction": "Reproductive methods and life cycle",
  "ecologicalRole": "Role in ecosystem and interactions with other species",
  "funFact": "An interesting and educational fact about this species",
  "threats": "Major threats to the species",
  "humanInteraction": "Relationship with humans (domestication, cultural significance, etc.)"
}

For humans, include information about:
- Anthropological classification
- Physical characteristics
- Cognitive abilities
- Social behavior
- Cultural evolution

Always provide accurate, educational, and scientifically correct information. If you cannot identify the exact species, provide your best assessment with the closest match.`;

    const userContent: any[] = [];
    
    if (image) {
      userContent.push({
        type: "text",
        text: "Please identify this species from the image and provide comprehensive biological information in JSON format."
      });
      userContent.push({
        type: "image_url",
        image_url: {
          url: image
        }
      });
    } else if (speciesName) {
      userContent.push({
        type: "text",
        text: `Please provide comprehensive biological information about "${speciesName}" in JSON format.`
      });
    } else {
      throw new Error("Either image or speciesName is required");
    }

    console.log("Calling Lovable AI for species identification...");

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
          { role: "user", content: userContent }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received:", content?.substring(0, 200));

    // Parse JSON from the response
    let speciesInfo;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
      speciesInfo = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Attempt to extract key information from text response
      speciesInfo = {
        commonName: "Unknown Species",
        scientificName: "Species unknown",
        taxonomy: {
          kingdom: "Unknown",
          phylum: "Unknown",
          class: "Unknown",
          order: "Unknown",
          family: "Unknown",
          genus: "Unknown",
          species: "Unknown"
        },
        habitat: content?.substring(0, 200) || "Unable to determine",
        diet: "Unable to determine",
        behavior: "Unable to determine",
        conservationStatus: "Not Evaluated",
        evolution: "Unable to determine",
        physicalCharacteristics: "Unable to determine",
        reproduction: "Unable to determine",
        ecologicalRole: "Unable to determine",
        funFact: "Our AI is still learning about this species!",
        threats: "Unable to determine",
        humanInteraction: "Unable to determine"
      };
    }

    return new Response(JSON.stringify(speciesInfo), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in identify-species function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
