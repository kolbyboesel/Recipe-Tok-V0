import React, { useState, useContext } from 'react';
import { UserSettingsContext } from '../../src/components/UserSettings';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaMinusCircle, FaSave, FaTimes, FaClock, FaCarrot, FaListUl, FaTags } from 'react-icons/fa';
import Spinner from '../components/LoadingSpinner';

const AddRecipe = () => {
    const { userSettings, userRecipes, setUserRecipes } = useContext(UserSettingsContext);
    const [error, setError] = useState('');
    const [submitPressed, setSubmitPressed] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // For tag input
    const [tagInput, setTagInput] = useState('');
    const [tagArray, setTagArray] = useState([]);

    // For step-by-step instructions
    const [stepsArray, setStepsArray] = useState(['']);

    // For ingredients
    const [ingredientsArray, setIngredientsArray] = useState(['']);

    const [formData, setFormData] = useState({
        name: '',
        recipeId: Math.floor(Math.random() * 100000),
        minutes: 0,
        contributorId: 0,
        submittedDate: new Date().toISOString().split('T')[0],
        tags: '',
        nutrition: '',
        numberOfSteps: 0,
        steps: '',
        description: '',
        ingredients: '',
        numberOfIngredients: 0,
        createdBy: userSettings?.loginID || '',
    });

    // Handle ingredients array changes
    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredientsArray];
        newIngredients[index] = value;
        setIngredientsArray(newIngredients);

        // Update form data
        setFormData(prev => ({
            ...prev,
            ingredients: newIngredients.join('|'),
            numberOfIngredients: newIngredients.filter(ing => ing.trim() !== '').length
        }));
    };

    const addIngredientField = () => {
        setIngredientsArray([...ingredientsArray, '']);
    };

    const removeIngredientField = (index) => {
        if (ingredientsArray.length > 1) {
            const newIngredients = ingredientsArray.filter((_, i) => i !== index);
            setIngredientsArray(newIngredients);

            // Update form data
            setFormData(prev => ({
                ...prev,
                ingredients: newIngredients.join('|'),
                numberOfIngredients: newIngredients.filter(ing => ing.trim() !== '').length
            }));
        }
    };

    // Handle steps array changes
    const handleStepChange = (index, value) => {
        const newSteps = [...stepsArray];
        newSteps[index] = value;
        setStepsArray(newSteps);

        // Update form data
        setFormData(prev => ({
            ...prev,
            steps: newSteps.join('|'),
            numberOfSteps: newSteps.filter(step => step.trim() !== '').length
        }));
    };

    const addStepField = () => {
        setStepsArray([...stepsArray, '']);
    };

    const removeStepField = (index) => {
        if (stepsArray.length > 1) {
            const newSteps = stepsArray.filter((_, i) => i !== index);
            setStepsArray(newSteps);

            // Update form data
            setFormData(prev => ({
                ...prev,
                steps: newSteps.join('|'),
                numberOfSteps: newSteps.filter(step => step.trim() !== '').length
            }));
        }
    };

    // Handle tag input
    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !tagArray.includes(tag)) {
            const newTagArray = [...tagArray, tag];
            setTagArray(newTagArray);
            setTagInput('');

            // Update form data with proper format for the API
            setFormData(prev => ({
                ...prev,
                tags: JSON.stringify(newTagArray).replace(/"/g, "'")
            }));
        }
    };

    const removeTag = (tagToRemove) => {
        const newTagArray = tagArray.filter(tag => tag !== tagToRemove);
        setTagArray(newTagArray);

        // Update form data
        setFormData(prev => ({
            ...prev,
            tags: newTagArray.length > 0 ? JSON.stringify(newTagArray).replace(/"/g, "'") : ''
        }));
    };

    // Handle regular form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        navigate('/Account');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitPressed(true);
        setError('');
        setIsLoading(true);
        // Final data preparation
        const finalFormData = {
            ...formData,
            // Ensure tags are in the correct format
            tags: tagArray.length > 0 ? JSON.stringify(tagArray).replace(/"/g, "'") : '',
            // Ensure steps and ingredients are properly formatted
            steps: stepsArray.join('|'),
            ingredients: ingredientsArray.join('|'),
            // Calculate the counts
            numberOfSteps: stepsArray.filter(step => step.trim() !== '').length,
            numberOfIngredients: ingredientsArray.filter(ing => ing.trim() !== '').length
        };

        try {
            const response = await fetch('https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/new-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalFormData)
            });

            if (response.ok) {
                const addedRecipe = await response.json();
                setUserRecipes([...userRecipes, addedRecipe]);
                setSuccessMessage('Recipe added successfully!');

                // Reset fields after 2 seconds
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/Account');
                }, 2000);
            } else {
                setError('Failed to add recipe. Please check the form and try again.');
            }
        } catch (err) {
            setError('An error occurred while adding the recipe.');
        } finally {
            setIsLoading(false);
            setSubmitPressed(false);
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="container page">
            <div className="page-content-container">
                <h2 className="text-center">Add New Recipe</h2>

                {successMessage && (
                    <div className="alert-success">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-section form-section-first">
                        <h3 className="section-title">
                            Basic Information
                        </h3>

                        <div className="form-group">
                            <label className="form-label">
                                Recipe Name*
                            </label>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Enter a descriptive name for your recipe"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row-split">
                            <div className="form-group">
                                <label className="form-label">
                                    <FaClock /> Cooking Time (minutes)*
                                </label>
                                <input
                                    type="number"
                                    className="search-input"
                                    name="minutes"
                                    value={formData.minutes}
                                    min="0"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaTags /> Recipe Tags
                            </label>
                            <div className="tag-input-wrapper">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Type tag and press Enter or comma to add (e.g. quick, dinner, healthy)"
                                    value={tagInput}
                                    onChange={handleTagInputChange}
                                    onKeyDown={handleTagKeyDown}
                                    onBlur={addTag}
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="tag-button"
                                >
                                    <FaPlusCircle />
                                </button>
                            </div>

                            {tagArray.length > 0 && (
                                <div className="tag-container">
                                    {tagArray.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="tag-item"
                                        >
                                            {tag}
                                            <FaTimes
                                                className="tag-remove"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Description
                            </label>
                            <textarea
                                className="search-input"
                                name="description"
                                placeholder="Write a brief description of your recipe..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">
                            <FaCarrot /> Ingredients
                        </h3>

                        {ingredientsArray.map((ingredient, index) => (
                            <div key={index} className="input-row">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder={`Ingredient #${index + 1}`}
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeIngredientField(index)}
                                    className="remove-button"
                                    title="Remove ingredient"
                                >
                                    <FaMinusCircle />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addIngredientField}
                            className="add-more-button"
                        >
                            <FaPlusCircle /> Add Another Ingredient
                        </button>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">
                            <FaListUl /> Preparation Steps
                        </h3>

                        {stepsArray.map((step, index) => (
                            <div key={index} className="input-row">
                                <div className="step-number">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        className="search-input"
                                        placeholder={`Describe step #${index + 1}`}
                                        value={step}
                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                        rows="2"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeStepField(index)}
                                    className="remove-button"
                                    title="Remove step"
                                >
                                    <FaMinusCircle />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addStepField}
                            className="add-more-button"
                        >
                            <FaPlusCircle /> Add Another Step
                        </button>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-red"
                        >
                            <FaTimes /> Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitPressed}
                        >
                            <FaSave /> {submitPressed ? 'Saving...' : 'Save Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRecipe;