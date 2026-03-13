"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRecipe.css";

const AddRecipe = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [chef, setChef] = useState("");
  const [image, setImage] = useState("");
  const [calories, setCalories] = useState("");
  const [timeToComplete, setTimeToComplete] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([""]);

  // Ingredients handlers
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };
  const addIngredientField = () => {
    const last = ingredients[ingredients.length - 1];
    if (last && last.trim() !== "") {
      setIngredients([...ingredients, ""]);
    }
  };
  const removeIngredientField = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  // Steps handlers
  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };
  const addStepField = () => {
    const last = steps[steps.length - 1];
    if (last && last.trim() !== "") {
      setSteps([...steps, ""]);
    }
  };
  const removeStepField = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecipe = {
      id: Date.now(),
      name,
      chef,
      description,
      image: image || "/placeholder.svg",
      calories: parseInt(calories),
      timeToComplete,
      ingredients: ingredients.filter((ing) => ing.trim() !== ""),
      rating: parseFloat(rating),
      steps: steps.filter((step) => step.trim() !== ""),
    };

    const existingRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    existingRecipes.push(newRecipe);
    localStorage.setItem("userRecipes", JSON.stringify(existingRecipes));

    navigate("/recipe");
  };

  return (
    <div className="add-recipe-page">
      <h2 className="add-recipe-header">Add a New Recipe</h2>
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <div className="add-recipe-form-group">
          <label>
            Recipe Name:
            <input type="text" value={name} required onChange={(e) => setName(e.target.value)} />
          </label>
        </div>

        <div className="add-recipe-form-group">
          <label>
            Chef Name:
            <input type="text" value={chef} required onChange={(e) => setChef(e.target.value)} />
          </label>
        </div>

        <div className="add-recipe-form-group">
          <label>
            Description:
            <textarea
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Write a short description..."
            />
          </label>
        </div>

        <div className="add-recipe-form-group">
          <label>
            Image URL:
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
          </label>
        </div>

        <div className="add-recipe-form-row">
          <div className="add-recipe-form-group">
            <label>
              Calories:
              <input
                type="number"
                value={calories}
                required
                onChange={(e) => setCalories(e.target.value)}
              />
            </label>
          </div>

          <div className="add-recipe-form-group">
            <label>
              Time to Complete:
              <input
                type="text"
                value={timeToComplete}
                required
                onChange={(e) => setTimeToComplete(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Ingredient Section */}
        <div className="ingredient-section">
          <label className="ingredient-label">🥬 Ingredients</label>
          <div className="ingredient-input-wrapper">
            <input
              type="text"
              placeholder="Add an ingredient..."
              value={ingredients[ingredients.length - 1]}
              onChange={(e) =>
                handleIngredientChange(ingredients.length - 1, e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addIngredientField();
                }
              }}
              className="ingredient-input"
            />
            <button
              type="button"
              onClick={addIngredientField}
              className="ingredient-add-btn"
              aria-label="Add ingredient"
            >
              +
            </button>
          </div>

          <div className="ingredient-badge-list">
            <span className="ingredient-count">
              {ingredients.filter((ing) => ing.trim() !== "").length}
            </span>
            {ingredients
              .filter((ing) => ing.trim() !== "")
              .map((ing, index) => (
                <span key={index} className="ingredient-badge">
                  🌿 {ing}
                  <button
                    type="button"
                    className="ingredient-remove-btn"
                    onClick={() => removeIngredientField(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        </div>

        {/* Steps Section */}
        <div className="steps-section">
          <label className="steps-label">📝 Steps</label>
          <div className="step-input-wrapper">
            <input
              type="text"
              placeholder="Add a step..."
              value={steps[steps.length - 1]}
              onChange={(e) => handleStepChange(steps.length - 1, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addStepField();
                }
              }}
              className="step-input"
            />
            <button
              type="button"
              onClick={addStepField}
              className="step-add-btn"
              aria-label="Add step"
            >
              +
            </button>
          </div>

          <div className="step-badge-list">
            <span className="step-count">{steps.filter((s) => s.trim() !== "").length}</span>
            {steps
              .filter((step) => step.trim() !== "")
              .map((step, index) => (
                <span key={index} className="step-badge">
                  📝 {step}
                  <button
                    type="button"
                    className="step-remove-btn"
                    onClick={() => removeStepField(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        </div>

        <div className="add-recipe-actions">
          <button type="submit" className="add-recipe-submit-button">
            Submit Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
