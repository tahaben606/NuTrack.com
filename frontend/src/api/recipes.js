const API_URL = 'http://localhost:5000/api';

export const fetchRecipes = async () => {
    const response = await fetch(`${API_URL}/recipes`);
    if (!response.ok) {
        throw new Error('Failed to fetch recipes');
    }
    return response.json();
};

export const fetchRecipeById = async (id) => {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch recipe');
    }
    return response.json();
};

export const searchRecipesByIngredients = async (ingredients) => {
    const queryParams = ingredients.map(ing => `ingredients=${encodeURIComponent(ing)}`).join('&');
    const response = await fetch(`${API_URL}/recipes/search?${queryParams}`);
    if (!response.ok) {
        throw new Error('Failed to search recipes');
    }
    return response.json();
};

export const addRecipe = async (recipe) => {
    const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });
    if (!response.ok) {
        throw new Error('Failed to add recipe');
    }
    return response.json();
};

export const updateRecipe = async (id, recipe) => {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
    });
    if (!response.ok) {
        throw new Error('Failed to update recipe');
    }
    return response.json();
};

export const deleteRecipe = async (id) => {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete recipe');
    }
    return response.json();
}; 