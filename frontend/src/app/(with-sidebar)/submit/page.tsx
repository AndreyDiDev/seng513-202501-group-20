"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Mock user data
const mockUser = {
  name: "Juanito Escobar",
  email: "escobar@example.com",
  isPremium: false,
}

// Recipe categories
const recipeCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Soup",
  "Salad",
  "Beverage",
  "Other",
]

// Cuisine types
const cuisineTypes = [
  "American",
  "Italian",
  "Mexican",
  "Asian",
  "Mediterranean",
  "Indian",
  "French",
  "Greek",
  "Spanish",
  "Thai",
  "Japanese",
  "Chinese",
  "Middle Eastern",
  "Other",
]

export default function RecipeSubmissionPage() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPremium, setIsPremium] = useState(mockUser.isPremium)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form state
  const [recipeForm, setRecipeForm] = useState({
    title: "",
    description: "",
    category: "Dinner",
    cuisine: "American",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "Medium",
    ingredients: [""],
    instructions: [""],
    notes: "",
    tags: "",
  })

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRecipeForm({
      ...recipeForm,
      [name]: value,
    })
  }

  // Handle ingredient changes
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...recipeForm.ingredients]
    updatedIngredients[index] = value
    setRecipeForm({
      ...recipeForm,
      ingredients: updatedIngredients,
    })
  }

  // Add new ingredient field
  const addIngredientField = () => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, ""],
    })
  }

  // Remove ingredient field
  const removeIngredientField = (index: number) => {
    if (recipeForm.ingredients.length > 1) {
      const updatedIngredients = [...recipeForm.ingredients]
      updatedIngredients.splice(index, 1)
      setRecipeForm({
        ...recipeForm,
        ingredients: updatedIngredients,
      })
    }
  }

  // Handle instruction changes
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...recipeForm.instructions]
    updatedInstructions[index] = value
    setRecipeForm({
      ...recipeForm,
      instructions: updatedInstructions,
    })
  }

  // Add new instruction field
  const addInstructionField = () => {
    setRecipeForm({
      ...recipeForm,
      instructions: [...recipeForm.instructions, ""],
    })
  }

  // Remove instruction field
  const removeInstructionField = (index: number) => {
    if (recipeForm.instructions.length > 1) {
      const updatedInstructions = [...recipeForm.instructions]
      updatedInstructions.splice(index, 1)
      setRecipeForm({
        ...recipeForm,
        instructions: updatedInstructions,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (
      !recipeForm.title ||
      !recipeForm.description ||
      recipeForm.ingredients.some((ing) => !ing) ||
      recipeForm.instructions.some((inst) => !inst)
    ) {
      alert("Please fill in all required fields")
      return
    }
  
    setIsSubmitting(true)
  
    try {
      const response = await fetch("http://localhost:5003/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending session cookie
        body: JSON.stringify({
          title: recipeForm.title,
          time: `${recipeForm.prepTime} + ${recipeForm.cookTime} minutes`,
          calories: 0, // or whatever logic you want
          instructions: recipeForm.instructions.join("\n"),
          ingredients: recipeForm.ingredients,
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.error || "Failed to submit recipe")
      }
  
      setShowSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        setRecipeForm({
          title: "",
          description: "",
          category: "Dinner",
          cuisine: "American",
          prepTime: "",
          cookTime: "",
          servings: "",
          difficulty: "Medium",
          ingredients: [""],
          instructions: [""],
          notes: "",
          tags: "",
        })
      }, 3000)
    } catch (error) {
      console.error("Error submitting recipe:", error)
      alert("There was an error submitting your recipe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  

  // Handle premium upgrade
  const handleUpgradeToPremium = async () => {
    setIsUpgrading(true)

    try {
      // Make user premium
      const res = await fetch("http://localhost:5003/api/user/makePremium", {
        method: "GET",
        credentials: "include"
      });
      
      if (!res.ok) {
        throw new Error("Failed to make user premium")
      }

      const result = await res.json()
      console.log("User upgraded to premium:", result)
      // Success - update premium status
      setIsPremium(true)
      alert("Upgrade successful! You now have premium access.")
    } catch (error) {
      console.error("Error upgrading user:", error)
    }finally {
      setIsUpgrading(false)
    }
  }

  // Logout function
  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <>

      <div className="flex h-screen bg-gray-900">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center bg-gray-800 px-4 shadow-md lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-300 hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="ml-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-emerald-400"
            >
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" x2="18" y1="17" y2="17" />
            </svg>
            <span className="ml-2 text-lg font-bold text-gray-100">Meal Planner</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Content header */}
          <header className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-100">Submit Recipe to Database</h2>
            {!isPremium && (
              <button
                onClick={handleUpgradeToPremium}
                disabled={isUpgrading}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                {isUpgrading ? "Processing..." : "Upgrade to Premium"}
              </button>
            )}
          </header>

          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Premium required notice */}
            {!isPremium && (
              <div className="mb-6 rounded-md bg-amber-900/30 border border-amber-700/50 p-4">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-300">Premium Account Required</h3>
                    <div className="mt-2 text-sm text-amber-200">
                      <p>
                        You need a premium account to submit recipes to our database. You can still fill out the form,
                        but you'll need to upgrade to submit it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success message */}
            {showSuccess && (
              <div className="mb-6 rounded-md bg-emerald-900/30 border border-emerald-700/50 p-4">
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-emerald-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-emerald-300">Recipe Submitted Successfully!</h3>
                    <div className="mt-2 text-sm text-emerald-200">
                      <p>Your recipe has been added to our database. Thank you for your contribution!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recipe submission form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="rounded-md bg-gray-800 p-6 shadow-md">
                <h3 className="mb-4 text-lg font-medium text-gray-100">Basic Information</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                      Recipe Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={recipeForm.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={recipeForm.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Recipe Details */}
              <div className="rounded-md bg-gray-800 p-6 shadow-md">
                <h3 className="mb-4 text-lg font-medium text-gray-100">Recipe Details</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={recipeForm.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      {recipeCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cuisine" className="block text-sm font-medium text-gray-300">
                      Cuisine
                    </label>
                    <select
                      id="cuisine"
                      name="cuisine"
                      value={recipeForm.cuisine}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      {cuisineTypes.map((cuisine) => (
                        <option key={cuisine} value={cuisine}>
                          {cuisine}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-300">
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      id="prepTime"
                      name="prepTime"
                      value={recipeForm.prepTime}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="cookTime" className="block text-sm font-medium text-gray-300">
                      Cooking Time (minutes)
                    </label>
                    <input
                      type="number"
                      id="cookTime"
                      name="cookTime"
                      value={recipeForm.cookTime}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="servings" className="block text-sm font-medium text-gray-300">
                      Servings
                    </label>
                    <input
                      type="number"
                      id="servings"
                      name="servings"
                      value={recipeForm.servings}
                      onChange={handleInputChange}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">
                      Difficulty
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={recipeForm.difficulty}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="rounded-md bg-gray-800 p-6 shadow-md">
                <h3 className="mb-4 text-lg font-medium text-gray-100">Ingredients</h3>
                <div className="space-y-3">
                  {recipeForm.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                        className="flex-1 rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredientField(index)}
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                        disabled={recipeForm.ingredients.length <= 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIngredientField}
                    className="flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Ingredient
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-md bg-gray-800 p-6 shadow-md">
                <h3 className="mb-4 text-lg font-medium text-gray-100">Instructions</h3>
                <div className="space-y-3">
                  {recipeForm.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="mt-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        {index + 1}
                      </div>
                      <textarea
                        value={instruction}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        rows={2}
                        className="flex-1 rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      ></textarea>
                      <button
                        type="button"
                        onClick={() => removeInstructionField(index)}
                        className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                        disabled={recipeForm.instructions.length <= 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInstructionField}
                    className="flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Step
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="rounded-md bg-gray-800 p-6 shadow-md">
                <h3 className="mb-4 text-lg font-medium text-gray-100">Additional Notes</h3>
                <textarea
                  id="notes"
                  name="notes"
                  value={recipeForm.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any additional tips, variations, or notes about this recipe..."
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !isPremium}
                  className="rounded-md bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Recipe"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
