import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalProvider } from "./GlobalContext";
import RecipeTokNavbar from './components/RecipeTokNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cookbook from './pages/Cookbook';
import RecipeDetails from "./pages/RecipeDetails";
import Account from "./pages/Account";
import AddRecipe from "./pages/AddRecipe";
import Login from "./pages/AccountFunctions/Login";
import Signup from "./pages/AccountFunctions/Signup";
import ChangePassword from "./pages/AccountFunctions/ChangePassword";
import { UserSettingsProvider } from '../src/components/UserSettings';

function App() {
  return (
    <UserSettingsProvider>
      <Router>
        <RecipeTokNavbar />
        <GlobalProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Cookbook" element={<Cookbook />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/AddRecipe" element={<AddRecipe />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
          </Routes>
        </GlobalProvider>
        <Footer />
      </Router>
    </UserSettingsProvider>
  );
}

export default App;
