import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalProvider } from "./GlobalContext";
import RecipeTokNavbar from './components/RecipeTokNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cookbook from './pages/Cookbook';
import RecipeDetails from "./pages/RecipeDetails";


function App() {
  return (
    <Router>
      <RecipeTokNavbar />
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cookbook" element={<Cookbook />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
        </Routes>
      </GlobalProvider>
      <Footer />
    </Router>
  );
}

export default App;
