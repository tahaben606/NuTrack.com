import recipesData from '../pages/recipedata';

// Helper to get/set local recipes
const getLocalRecipes = () => {
    const saved = localStorage.getItem('recipes');
    if (!saved) {
        localStorage.setItem('recipes', JSON.stringify(recipesData));
        return recipesData;
    }
    return JSON.parse(saved);
};

const saveLocalRecipes = (recipes) => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
};

export const fetchRecipes = async () => {
    return getLocalRecipes();
};

export const fetchRecipeById = async (id) => {
    const recipes = getLocalRecipes();
    return recipes.find(r => r.id === parseInt(id)) || null;
};

export const searchRecipesByIngredients = async (ingredients) => {
    if (!ingredients || ingredients.length === 0) return [];
    const allRecipes = getLocalRecipes();
    const lowerIngredients = ingredients.map((i) => i.toLowerCase().trim());

    return allRecipes.filter((recipe) => {
        const recipeIngs = (recipe.ingredients || []).map((i) => String(i).toLowerCase().trim());
        return lowerIngredients.every((ing) =>
            recipeIngs.some((ri) => ri.includes(ing))
        );
    });
};

export const searchIngredients = async (q, limit = 20) => {
    const allRecipes = getLocalRecipes();
    const seen = new Set();
    const results = [];
    const query = (q || '').toLowerCase().trim();

    for (const recipe of allRecipes) {
        for (const ing of recipe.ingredients || []) {
            const norm = String(ing).toLowerCase().trim();
            if (!norm) continue;
            if (query && !norm.includes(query)) continue;
            if (seen.has(norm)) continue;
            seen.add(norm);
            results.push(norm);
            if (results.length >= limit) return results;
        }
    }
    return results;
};

export const addRecipe = async (recipe) => {
    const recipes = getLocalRecipes();
    const newRecipe = {
        ...recipe,
        id: Date.now(),
        rating: 5,
        created_at: new Date().toISOString()
    };
    recipes.push(newRecipe);
    saveLocalRecipes(recipes);
    return newRecipe;
};

export const updateRecipe = async (id, recipe) => {
    const recipes = getLocalRecipes();
    const idx = recipes.findIndex(r => r.id === parseInt(id));
    if (idx === -1) throw new Error("Recipe not found");
    
    recipes[idx] = { ...recipes[idx], ...recipe };
    saveLocalRecipes(recipes);
    return recipes[idx];
};

export const deleteRecipe = async (id) => {
    const recipes = getLocalRecipes();
    const filtered = recipes.filter(r => r.id !== parseInt(id));
    saveLocalRecipes(filtered);
    return { success: true };
};

// --- AI Service Functions ---

export const analyzeFridge = async (base64Image) => {
    const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OpenRouter API Key not found");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nutrack.com",
            "X-Title": "NuTrack"
        },
        body: JSON.stringify({
            "model": "google/gemini-2.0-flash-001",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this fridge image and list ALL identifiable food items and ingredients you see. Return ONLY a JSON array of strings, for example: [\"tomato\", \"milk\", \"egg\"]. Use singular form for all ingredients."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": base64Image
                            }
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to analyze fridge image");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    try {
        const jsonMatch = content.match(/\[.*\]/s);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
        console.error("Failed to parse AI response:", content);
        return [];
    }
};

export const generateRecipe = async (ingredients) => {
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key not found");

    const prompt = `Create a unique and delicious recipe using these ingredients: ${ingredients.join(", ")}.
Return the response ONLY as a JSON object with this exact structure:
{
  "name": "Recipe Name",
  "chef": "AI Chef",
  "description": "Short description",
  "ingredients": ["ing1", "ing2"],
  "quantities": ["qty1", "qty2"],
  "steps": ["step1", "step2"],
  "calories": 0,
  "timeToComplete": "X minutes",
  "rating": 5,
  "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  "video": ""
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to generate recipe");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    try {
        const jsonMatch = content.match(/\{.*\}/s);
        return jsonMatch ? { recipe: JSON.parse(jsonMatch[0]) } : { recipe: null };
    } catch (e) {
        console.error("Failed to parse AI recipe:", content);
        return { recipe: null };
    }
};