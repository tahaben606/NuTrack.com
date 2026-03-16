"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Clock, Flame, ChevronUp,
  ChevronDown, X, Utensils
} from 'lucide-react';
import './store.css';
import recipes from './recipedata';
import { fetchRecipes, searchIngredients } from "../api/recipes";

const Store = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [backendRecipes, setBackendRecipes] = useState(null);
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);

  // Include user-created recipes (saved in localStorage) so their ingredients are searchable too
  const userRecipes = (() => {
    try {
      return JSON.parse(localStorage.getItem("userRecipes")) || [];
    } catch {
      return [];
    }
  })();

  // Load recipes from Flask (data.json). If it fails, fallback to local static data.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchRecipes();
        if (!cancelled) setBackendRecipes(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setBackendRecipes([]); // keep app functional; will fallback below
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const baseRecipes =
    backendRecipes && backendRecipes.length > 0 ? backendRecipes : recipes;
  const allRecipes = [...baseRecipes, ...userRecipes];

  const allIngredients = [
    ...new Set(
      allRecipes
        .flatMap((r) => r.ingredients || [])
        .map((ing) => String(ing).trim())
        .filter(Boolean)
        .map((ing) => ing.toLowerCase())
    ),
  ];

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredIngredients =
    ingredientSuggestions.length > 0
      ? ingredientSuggestions
      : allIngredients.filter((ing) => ing.includes(normalizedSearchTerm));

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsDropdownVisible(true);
      (async () => {
        try {
          const suggestions = await searchIngredients(searchTerm, 20);
          setIngredientSuggestions(Array.isArray(suggestions) ? suggestions : []);
        } catch {
          setIngredientSuggestions([]);
        }
      })();
    } else {
      setIsDropdownVisible(false);
      setIngredientSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setErrorMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      addIngredient(searchTerm.trim());
    }
  };

  const addIngredient = (ingredient) => {
    const normalized = String(ingredient).trim().toLowerCase();
    if (!normalized) return;

    // Accept exact match OR substring match (e.g., user types "parsley" and we have "fresh parsley")
    const isValid =
      allIngredients.includes(normalized) ||
      allIngredients.some((ing) => ing.includes(normalized));
    if (!isValid) {
      setErrorMessage(`"${ingredient}" is not a valid ingredient.`);
      return;
    }

    if (!selectedIngredients.includes(normalized)) {
      setSelectedIngredients([...selectedIngredients, normalized]);
    }

    setSearchTerm('');
    setErrorMessage('');
    setIsDropdownVisible(false);
  };

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const getMatchPercentage = (recipeIngredients) => {
    if (!selectedIngredients.length) return 0;
    const normalized = recipeIngredients.map(i => i.toLowerCase());
    const matched = selectedIngredients.filter(sel =>
      normalized.some(ing => ing.includes(sel))
    ).length;
    return (matched / recipeIngredients.length) * 100;
  };

  const getMatchColor = (percent) => {
    if (percent === 100) return '#673AB7';
    if (percent >= 70) return '#4CAF50';
    if (percent >= 50) return '#f2e449';
    return '#FF5722';
  };

  const toggleFilter = (type) => {
    if (filterType === type) {
      setFilterType('');
    } else {
      setFilterType(type);
      if (!sortOrder) setSortOrder('up');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'up' ? 'down' : 'up');
  };

  const filteredRecipes = allRecipes
    .map(recipe => ({
      ...recipe,
      matchPercentage: getMatchPercentage(recipe.ingredients),
    }))
    .filter(recipe => !selectedIngredients.length || recipe.matchPercentage > 0)
    .sort((a, b) => {
      if (filterType === 'calories') {
        return sortOrder === 'up' ? a.calories - b.calories : b.calories - a.calories;
      }
      if (filterType === 'time') {
        return sortOrder === 'up'
          ? parseInt(a.timeToComplete) - parseInt(b.timeToComplete)
          : parseInt(b.timeToComplete) - parseInt(a.timeToComplete);
      }
      if (filterType === 'quantity') {
        return sortOrder === 'up'
          ? a.ingredients.length - b.ingredients.length
          : b.ingredients.length - a.ingredients.length;
      }
      return b.matchPercentage - a.matchPercentage;
    });

  return (
    <div className="store-container">
      <div className="store-header">
        <div className="store-logo">
          <Utensils className="store-logo-icon" />
          <h1>Nutrack</h1>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for ingredients..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsDropdownVisible(true)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <X size={16} />
              </button>
            )}
          </div>

          {isDropdownVisible && filteredIngredients.length > 0 && (
            <div className="ingredients-dropdown">
              {filteredIngredients.slice(0, 6).map((ingredient, idx) => (
                <div
                  key={idx}
                  className="ingredient-dropdown-item"
                  onClick={() => addIngredient(ingredient)}
                >
                  {ingredient}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="selected-ingredients-container">
        {selectedIngredients.map((ing, idx) => (
          <div key={idx} className="ingredient-tag">
            <span>{ing}</span>
            <button onClick={() => removeIngredient(ing)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="filter-controls">
          <div className="filter-buttons">
            <button
              className={`filter-button ${filterType === 'calories' ? 'active' : ''}`}
              onClick={() => toggleFilter('calories')}
            >
              <Flame size={16} />
              <span>Calories</span>
            </button>

            <button
              className={`filter-button ${filterType === 'time' ? 'active' : ''}`}
              onClick={() => toggleFilter('time')}
            >
              <Clock size={16} />
              <span>Time</span>
            </button>

            <button
              className={`filter-button ${filterType === 'quantity' ? 'active' : ''}`}
              onClick={() => toggleFilter('quantity')}
            >
              <Filter size={16} />
              <span>Ingredients</span>
            </button>

            {filterType && (
              <button className="sort-button" onClick={toggleSortOrder}>
                {sortOrder === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="recipes-container">
        {selectedIngredients.length === 0 ? (
          <div className="default-view">
            <div className="default-icon">
              <Utensils size={48} />
            </div>
            <h2>What's in your fridge?</h2>
            <p>Add ingredients to find matching recipes</p>
          </div>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="recipe-card-link">
              <div className="recipe-card">
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
                    {'★'.repeat(Math.floor(recipe.rating))}
                    {'☆'.repeat(5 - Math.floor(recipe.rating))}
                  </div>

                  <div className="recipe-ingredients-preview">
                    <p>
                      Ingredients: {recipe.ingredients.slice(0, 3).join(', ')}
                      {recipe.ingredients.length > 3 ? ` +${recipe.ingredients.length - 3} more` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>No recipes found with your ingredients</p>
            <p>Try adding different ingredients</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
