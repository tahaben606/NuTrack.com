import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Recipe from './pages/store';
import RecipeDetails from './pages/recipedetails';
import LoginPage from './pages/login';
import SignUp from './pages/signup';
import AddRecipe from './pages/AddRecipe';
import About from './pages/about';

import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/addrecipe" element={<AddRecipe />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
