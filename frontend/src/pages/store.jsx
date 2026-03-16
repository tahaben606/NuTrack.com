"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Flame,
  ChevronUp,
  ChevronDown,
  X,
  Utensils,
  Plus,
  Camera,
  Sparkles,
  Loader2
} from "lucide-react";
import "./store.css";
import { fetchRecipes, analyzeFridge, generateRecipe } from "../api/recipes";

const Store = () => {
  // State declarations
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortOrder, setSortOrder] = useState("up");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);

  const [isAnalyzingFridge, setIsAnalyzingFridge] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Load recipes from backend when component mounts
  useEffect(() => {
    const loadBackendRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRecipes();
        setRecipes(data);

        // Calculate all unique ingredients
        const ingredients = [
          ...new Set(
            data.flatMap((recipe) =>
              (recipe.ingredients || []).map((ing) => ing.toLowerCase().trim())
            )
          ),
        ].sort();
        setAllIngredients(ingredients);
      } catch (error) {
        console.error("Error loading recipes:", error);
        setErrorMessage("Could not connect to the server. Please ensure the backend is running.");

        // Fallback to local storage recipes if backend fails
        const localRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
        setRecipes(localRecipes);
      } finally {
        setIsLoading(false);
      }
    };

    loadBackendRecipes();
  }, []);

  // Filter ingredients based on search term
  const filteredIngredients = allIngredients.filter((ingredient) =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add ingredient to selected list if valid and not duplicate
  const addIngredient = (ingredient) => {
    const normalizedIngredient = ingredient.toLowerCase().trim();

    if (!allIngredients.includes(normalizedIngredient)) {
      setErrorMessage(`"${ingredient}" is not a valid ingredient.`);
      return;
    }

    if (!selectedIngredients.includes(normalizedIngredient)) {
      setSelectedIngredients([...selectedIngredients, normalizedIngredient]);
    }

    setSearchTerm("");
    setErrorMessage("");
    setIsDropdownVisible(false);
  };

  // Remove ingredient tag
  const removeIngredient = (ingredient) => {
    setSelectedIngredients(
      selectedIngredients.filter((item) => item !== ingredient)
    );
  };

  // Show dropdown only if searching and results exist
  useEffect(() => {
    setIsDropdownVisible(searchTerm.trim().length > 0 && filteredIngredients.length > 0);
  }, [searchTerm, filteredIngredients.length]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setErrorMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      e.preventDefault();
      addIngredient(searchTerm.trim());
    }
  };

  const handleFridgeCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzingFridge(true);
    setErrorMessage("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        const ingredients = await analyzeFridge(base64Image);
        
        if (ingredients && ingredients.length > 0) {
          // Add valid ingredients from the AI to the selection
          const newIngredients = ingredients.filter(
            ing => !selectedIngredients.includes(ing)
          );
          if (newIngredients.length > 0) {
            setSelectedIngredients(prev => [...prev, ...newIngredients]);
            // Also update allIngredients if these are new
            setAllIngredients(prev => [...new Set([...prev, ...newIngredients])].sort());
          }
        } else {
          setErrorMessage("AI didn't find any identifiable ingredients in this image.");
        }
      } catch (error) {
        console.error("Error analyzing fridge:", error);
        setErrorMessage(error.message || "Could not analyze image. Try again.");
      } finally {
        setIsAnalyzingFridge(false);
        e.target.value = null;
      }
    };
  };

  const handleGenerateRecipe = async () => {
    if (selectedIngredients.length === 0) return;

    setIsGeneratingRecipe(true);
    setErrorMessage("");

    try {
      const data = await generateRecipe(selectedIngredients);

      if (data.recipe) {
        // Update state
        setRecipes(prev => [data.recipe, ...prev]);
        setAllIngredients(prev => {
          const newIngs = (data.recipe.ingredients || [])
            .map(ing => ing.toLowerCase().trim())
            .filter(ing => !prev.includes(ing));
          return [...prev, ...newIngs].sort();
        });
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      setErrorMessage(error.message || "Could not generate recipe. Try again.");
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  // Calculate match percentage of recipe ingredients with selected ingredients
  const getMatchPercentage = (recipeIngredients) => {
    if (selectedIngredients.length === 0) return 0;
    const normalizedRecipeIngredients = recipeIngredients.map((i) =>
      i.toLowerCase().trim()
    );
    const matchedCount = selectedIngredients.filter((selIng) =>
      normalizedRecipeIngredients.includes(selIng)
    ).length;

    return (matchedCount / recipeIngredients.length) * 100;
  };

  // Color coding for match percentage badge
  const getMatchColor = (percentage) => {
    if (percentage === 100) return "#673AB7"; // Purple
    if (percentage >= 70) return "#4CAF50"; // Green
    if (percentage >= 50) return "#f2e449"; // Yellow
    return "#FF5722"; // Red
  };

  // Toggle filter and reset sort order if needed
  const toggleFilter = (type) => {
    if (filterType === type) {
      setFilterType("");
      setSortOrder("up");
    } else {
      setFilterType(type);
      setSortOrder("up");
    }
  };

  // Toggle sorting order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "up" ? "down" : "up");
  };

  // Filter and sort recipes based on selected ingredients and filter/sort state
  const filteredRecipes = recipes
    .map((recipe) => ({
      ...recipe,
      matchPercentage: getMatchPercentage(recipe.ingredients),
    }))
    .filter(
      (recipe) =>
        selectedIngredients.length === 0 || recipe.matchPercentage > 0
    )
    .sort((a, b) => {
      if (filterType === "calories") {
        return sortOrder === "up"
          ? a.calories - b.calories
          : b.calories - a.calories;
      } else if (filterType === "time") {
        const timeA = parseInt(a.timeToComplete);
        const timeB = parseInt(b.timeToComplete);
        return sortOrder === "up" ? timeA - timeB : timeB - timeA;
      } else if (filterType === "quantity") {
        return sortOrder === "up"
          ? a.ingredients.length - b.ingredients.length
          : b.ingredients.length - a.ingredients.length;
      } else {
        return b.matchPercentage - a.matchPercentage;
      }
    });

  return (
    <div className="store-container">
      <header className="store-header">
        <div className="store-logo">
          <Utensils className="store-logo-icon" />
          <h1>Nutrack</h1>
        </div>

        <button
          className="add-recipe-button"
          onClick={() => (window.location.href = "/addrecipe")}
        >
          <span>Add Recipe</span>
          <Plus size={16} />
        </button>

        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search ingredients (e.g., 'tomato')..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsDropdownVisible(true)}
              autoComplete="off"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <div className="fridge-capture-wrapper">
              <input
                type="file"
                id="fridge-capture"
                accept="image/*"
                onChange={handleFridgeCapture}
                style={{ display: "none" }}
              />
              <label htmlFor="fridge-capture" className="fridge-capture-button" title="Capture Fridge">
                {isAnalyzingFridge ? <Loader2 className="spinner-icon" size={18} /> : <Camera size={18} />}
              </label>
            </div>
          </div>
          <p className="search-hint">Please use singular form for ingredients (e.g., 'onion' not 'onions')</p>

          {isDropdownVisible && filteredIngredients.length > 0 && (
            <div className="ingredients-dropdown">
              {filteredIngredients.slice(0, 6).map((ingredient, idx) => (
                <div
                  key={idx}
                  className="ingredient-dropdown-item"
                  onClick={() => addIngredient(ingredient)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      addIngredient(ingredient);
                    }
                  }}
                >
                  {ingredient}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="selected-ingredients-container">
        {selectedIngredients.map((ingredient, idx) => (
          <div key={idx} className="ingredient-tag">
            <span>{ingredient}</span>
            <button
              onClick={() => removeIngredient(ingredient)}
              aria-label={`Remove ${ingredient}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="filter-controls">
          <div className="filter-buttons">
            <button
              className={`filter-button ${filterType === "calories" ? "active" : ""
                }`}
              onClick={() => toggleFilter("calories")}
            >
              <Flame size={16} />
              <span>Calories</span>
            </button>

            <button
              className={`filter-button ${filterType === "time" ? "active" : ""}`}
              onClick={() => toggleFilter("time")}
            >
              <Clock size={16} />
              <span>Time</span>
            </button>

            <button
              className={`filter-button ${filterType === "quantity" ? "active" : ""
                }`}
              onClick={() => toggleFilter("quantity")}
            >
              <Filter size={16} />
              <span>Ingredients</span>
            </button>

            {filterType && (
              <button className="sort-button" onClick={toggleSortOrder}>
                {sortOrder === "up" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      <main className="recipes-container">
        {selectedIngredients.length === 0 ? (
          <div className="default-view">
            <div className="default-icon">
              <Utensils size={48} />
            </div>
            <h2>What's in your fridge?</h2>
            <p>Add ingredients to find matching recipes</p>
          </div>
        ) : isLoading ? (
          <div className="loading-view">
            <Loader2 className="spinner-icon" size={40} />
            <p>Fetching delicious recipes...</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe.id}`}
              key={recipe.id}
              className="recipe-card-link"
            >
              <article className="recipe-card">
                <div className="recipe-image-container">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.name}
                    className="recipe-image"
                  />
                  <div
                    className="match-badge"
                    style={{ backgroundColor: getMatchColor(recipe.matchPercentage) }}
                  >
                    {recipe.matchPercentage.toFixed(0)}% Match
                  </div>
                </div>

                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <p className="recipe-chef">By {recipe.chef}</p>

                  <div className="recipe-meta">
                    <div className="recipe-meta-item">
                      <Flame size={16} className="recipe-meta-icon" />
                      <span>{recipe.calories} kcal</span>
                    </div>
                    <div className="recipe-meta-item">
                      <Clock size={16} className="recipe-meta-icon" />
                      <span>{recipe.timeToComplete}</span>
                    </div>
                  </div>

                  <div className="recipe-rating">
                    {"★".repeat(Math.floor(recipe.rating))}
                    {"☆".repeat(5 - Math.floor(recipe.rating))}
                  </div>

                  <div className="recipe-ingredients-preview">
                    <p>
                      Ingredients: {recipe.ingredients.slice(0, 3).join(", ")}
                      {recipe.ingredients.length > 3
                        ? ` +${recipe.ingredients.length - 3} more`
                        : ""}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>No recipes found with your ingredients</p>
            <p>Try adding different ingredients</p>
          </div>
        )}

        {selectedIngredients.length > 0 && (
          <div className="ai-suggestion-footer">
            <div className="divider">
              <span>OR</span>
            </div>
            <p className="ai-suggestion-text">Didn't find what you were looking for?</p>
            <button
              className="generate-recipe-button"
              onClick={handleGenerateRecipe}
              disabled={isGeneratingRecipe}
            >
              {isGeneratingRecipe ? (
                <><Loader2 className="spinner-icon" size={20} /> Generating Magic...</>
              ) : (
                <><Sparkles size={20} /> Create a unique AI Recipe</>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Store;
