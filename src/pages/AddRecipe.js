import React, { useState, useContext } from 'react';
import { UserSettingsContext } from '../../src/components/UserSettings';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
    const { userSettings, userRecipes, setUserRecipes } = useContext(UserSettingsContext);
    const [error, setError] = useState('');
    const [submitPressed, setSubmitPressed] = useState(false);
    const navigate = useNavigate();

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

        try {
            const response = await fetch('https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/new-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const addedRecipe = await response.json();
                setUserRecipes([...userRecipes, addedRecipe]);
                alert('Recipe added successfully!');
                // Reset fields
                setFormData({
                    ...formData,
                    name: '',
                    minutes: 0,
                    contributorId: 0,
                    tags: '',
                    nutrition: '',
                    numberOfSteps: 0,
                    steps: '',
                    description: '',
                    ingredients: '',
                    numberOfIngredients: 0
                });
                navigate('/Account');
            } else {
                setError('Failed to add recipe. Please check the form and try again.');
            }
        } catch (err) {
            setError('An error occurred while adding the recipe.');
        } finally {
            setSubmitPressed(false);
        }
    };

    return (
        <div className="container page">
            <form className="modal-content animate mobileScreen" onSubmit={handleSubmit}>
                <div className="modal-content-container container pt-5 h-auto">
                    <h2 className="mb-4">Add a Custom Recipe</h2>

                    <label className="left-align"><b>Recipe Name</b></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter recipe name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label className="left-align"><b>Minutes to Prepare</b></label>
                    <input
                        type="number"
                        className="form-control"
                        name="minutes"
                        value={formData.minutes}
                        onChange={handleChange}
                        required
                    />

                    <label className="left-align"><b>Contributor ID</b></label>
                    <input
                        type="number"
                        className="form-control"
                        name="contributorId"
                        value={formData.contributorId}
                        onChange={handleChange}
                    />

                    <label className="left-align"><b>Tags</b></label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. quick,dinner,healthy"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                    />

                    <label className="left-align"><b>Nutrition Info</b></label>
                    <input
                        type="text"
                        className="form-control"
                        name="nutrition"
                        value={formData.nutrition}
                        onChange={handleChange}
                    />

                    <label className="left-align"><b>Number of Steps</b></label>
                    <input
                        type="number"
                        className="form-control"
                        name="numberOfSteps"
                        value={formData.numberOfSteps}
                        onChange={handleChange}
                    />

                    <label className="left-align"><b>Steps</b></label>
                    <textarea
                        className="form-control"
                        name="steps"
                        placeholder="List steps here..."
                        value={formData.steps}
                        onChange={handleChange}
                    />

                    <label className="left-align"><b>Description</b></label>
                    <textarea
                        className="form-control"
                        name="description"
                        placeholder="Write a short description..."
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <label className="left-align"><b>Ingredients</b></label>
                    <textarea
                        className="form-control"
                        name="ingredients"
                        placeholder="List ingredients separated by commas"
                        value={formData.ingredients}
                        onChange={handleChange}
                    />

                    <label className="left-align"><b>Number of Ingredients</b></label>
                    <input
                        type="number"
                        className="form-control"
                        name="numberOfIngredients"
                        value={formData.numberOfIngredients}
                        onChange={handleChange}
                    />

                    <button className="confirm-btn mt-3" type="submit" disabled={submitPressed}>
                        {submitPressed ? 'Submitting...' : 'Add Recipe'}
                    </button>

                    {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                </div>

                <div className="container pb-5 pt-3 login-cancel">
                    <button onClick={handleCancel} className="bg-red" style={{ borderRadius: '5px' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRecipe;