"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock user data
const mockUser = {
  name: "Juanito Escobar",
  email: "escobar@example.com",
  isPremium: false,
}

type Recipe = {
  id: number
  title: string
  ingredients: string[]
  instructions?: string
  tags?: string[]
}


// Mock ingredients categories
const ingredientCategories = [
  { id: "proteins", name: "Proteins", color: "bg-red-900 text-red-100" },
  { id: "vegetables", name: "Vegetables", color: "bg-green-900 text-green-100" },
  { id: "fruits", name: "Fruits", color: "bg-yellow-900 text-yellow-100" },
  { id: "grains", name: "Grains", color: "bg-amber-900 text-amber-100" },
  { id: "dairy", name: "Dairy", color: "bg-blue-900 text-blue-100" },
  { id: "spices", name: "Spices", color: "bg-purple-900 text-purple-100" },
]

// Mock ingredients
const mockIngredients = [
  { id: 1, name: "Chicken Breast", category: "proteins" },
  { id: 2, name: "Salmon", category: "proteins" },
  { id: 3, name: "Tofu", category: "proteins" },
  { id: 4, name: "Spinach", category: "vegetables" },
  { id: 5, name: "Broccoli", category: "vegetables" },
  { id: 6, name: "Carrots", category: "vegetables" },
  { id: 7, name: "Apples", category: "fruits" },
  { id: 8, name: "Bananas", category: "fruits" },
  { id: 9, name: "Rice", category: "grains" },
  { id: 10, name: "Quinoa", category: "grains" },
  { id: 11, name: "Milk", category: "dairy" },
  { id: 12, name: "Cheese", category: "dairy" },
  { id: 13, name: "Cinnamon", category: "spices" },
  { id: 14, name: "Basil", category: "spices" },
  { id: 15, name: "Eggs", category: "proteins" },
  { id: 16, name: "Bell Peppers", category: "vegetables" },
  { id: 17, name: "Tomatoes", category: "vegetables" },
  { id: 18, name: "Avocado", category: "fruits" },
  { id: 19, name: "Bread", category: "grains" },
  { id: 20, name: "Pasta", category: "grains" },
]

export default function IngredientsPage() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<number[]>([])
  const [matchingRecipes, setMatchingRecipes] = useState<typeof Recipe>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [newIngredientCategory, setNewIngredientCategory] = useState("proteins")
  const [ingredients, setIngredients] = useState(mockIngredients)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Add a new state for the selected recipe and panel visibility
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof Recipe)[0] | null>(null)

  // Find ingredient name by ID
  const getIngredientNameById = (id: number) => {
    const ingredient = ingredients.find((ing) => ing.id === id)
    return ingredient ? ingredient.name : ""
  }

  // Update available ingredients and matching recipes when selected ingredients change
  useEffect(() => {
    // If no ingredients are selected, show all
    if (selectedIngredients.length === 0) {
      setAvailableIngredients(ingredients.map((ing) => ing.id))
      return
    }

    // Convert selected IDs to names
    const selectedIngredientNames = selectedIngredients.map((id) => getIngredientNameById(id))

    console.log("selected " + selectedIngredientNames)
  
    // Fetch matching recipes from the API
    fetch("http://localhost:5003/api/recipe/filteredGet", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: selectedIngredientNames,
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        console.log("data ", data.Ingredients)
        
        // Convert the fetched recipes
        const parsedRecipes = data.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          Ingredients: recipe.Ingredients?.map((ing: any) => ing.name) || [], // map to string[]
          instructions: recipe.instructions || "",
          tags: [],
        }))

        console.log("ingreidnets", parsedRecipes)

        // Set matchingRecipes
        setMatchingRecipes(parsedRecipes)

      })
      .catch((error) => {
        console.error("Error fetching recipes:", error)
      })
  }, [selectedIngredients, ingredients])
  

  // Filter ingredients by category, availability, and search term
  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesCategory = activeCategory === "all" || ingredient.category === activeCategory
    const isAvailable = availableIngredients.includes(ingredient.id)
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && isAvailable && matchesSearch
  })

  // Handle ingredient selection
  const toggleIngredient = (id: number) => {
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== id))
    } else {
      setSelectedIngredients([...selectedIngredients, id])
    }
  }

  // Add new ingredient
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault()
    if (newIngredient.trim()) {
      const newId = ingredients.length + 1
      setIngredients([
        ...ingredients,
        {
          id: newId,
          name: newIngredient.trim(),
          category: newIngredientCategory,
        },
      ])
      setNewIngredient("")
    }
  }

  // Logout function
  const handleLogout = () => {
    router.push("/login")
  }

  // View recipe details
  const viewRecipeDetails = (recipe: (typeof Recipe)[0]) => {
    console.log("here", recipe.Ingredients)
    const encodedRecipe = encodeURIComponent(JSON.stringify({
      ...recipe,
      Ingredients: recipe.Ingredients.map(String),
    }))
    router.push(`/recipes?data=${encodedRecipe}`)
  }

  return (
    <>
      <Head>
        <title>Ingredients - Meal Planner</title>
        <meta name="description" content="Manage your ingredients" />
      </Head>

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
        <div className="flex flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
          {/* Content header */}
          <header className="flex h-16 items-center justify-between border-b border-gray-700 bg-gray-800 px-6">
            <h1 className="text-lg font-semibold text-gray-100">Ingredients Management</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-md border border-gray-600 bg-gray-700 px-3 py-1 pl-8 text-sm text-gray-100 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
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
                  className="absolute left-2 top-1.5 h-4 w-4 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" x2="16.65" y1="21" y2="16.65" />
                </svg>
              </div>
            </div>
          </header>

          {/* Content body */}
          <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
            <div className="space-y-6">
              {/* Ingredient categories */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full px-4 py-1 text-sm font-medium ${
                    activeCategory === "all"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All
                </button>
                {ingredientCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`rounded-full px-4 py-1 text-sm font-medium ${
                      activeCategory === category.id
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Ingredients list */}
              <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Your Ingredients</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {filteredIngredients.map((ingredient) => {
                    const category = ingredientCategories.find((c) => c.id === ingredient.category)
                    return (
                      <div
                        key={ingredient.id}
                        onClick={() => toggleIngredient(ingredient.id)}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                          selectedIngredients.includes(ingredient.id)
                            ? "border-emerald-500 bg-emerald-900/30"
                            : "border-gray-700 hover:border-emerald-500/50 hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-100">{ingredient.name}</span>
                          {selectedIngredients.includes(ingredient.id) ? (
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
                              className="h-5 w-5 text-emerald-400"
                            >
                              <polyline points="9 11 12 14 22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                          ) : (
                            <span className={`rounded-full px-2 py-1 text-xs ${category?.color}`}>
                              {category?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {filteredIngredients.length === 0 && (
                    <div className="rounded-md bg-gray-700 p-4 text-center">
                      <p className="text-gray-300">No ingredients found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected ingredients */}
              {selectedIngredients.length > 0 && (
                <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                  <h2 className="mb-4 text-lg font-medium text-gray-100">Selected Ingredients</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredients.map((id) => {
                      const ingredient = ingredients.find((ing) => ing.id === id)
                      if (!ingredient) return null
                      return (
                        <div
                          key={id}
                          className="flex items-center rounded-full bg-emerald-900 px-3 py-1 text-sm text-emerald-100"
                        >
                          <span>{ingredient.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleIngredient(id)
                            }}
                            className="ml-2 rounded-full bg-emerald-800 p-0.5 hover:bg-emerald-700"
                          >
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
                              className="h-3 w-3"
                            >
                              <line x1="18" x2="6" y1="6" y2="18" />
                              <line x1="6" x2="18" y1="6" y2="18" />
                            </svg>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link
                      href="/submit"
                      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      Plan Meals with Selected Ingredients
                    </Link>
                  </div>
                </div>
              )}

              {/* Matching Recipes - Add New Ingredient */}
              <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Matching Recipes</h2>
                {matchingRecipes.length > 0 ? (
                  <div className="space-y-4">
                    {matchingRecipes.map((recipe) => (
                      <div key={recipe.id} className="rounded-md bg-gray-700 p-4">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium text-gray-100">{recipe.title}</h3>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {recipe.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-gray-600 px-2 py-0.5 text-xs text-gray-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <button
                            onClick={() => viewRecipeDetails(recipe)}
                            className="text-sm text-emerald-400 hover:text-emerald-300"
                          >
                            {selectedRecipe?.id === recipe.id ? "Hide Details" : "View Details"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    No recipes match your selected ingredients. Try selecting different ingredients.
                  </p>
                )}
              </div>

              {/* Add new ingredient form */}
              <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Add New Ingredient</h2>
                <form onSubmit={handleAddIngredient} className="space-y-4">
                  <div>
                    <label htmlFor="ingredientName" className="block text-sm font-medium text-gray-300">
                      Ingredient Name
                    </label>
                    <input
                      type="text"
                      id="ingredientName"
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Enter ingredient name"
                    />
                  </div>
                  <div>
                    <label htmlFor="ingredientCategory" className="block text-sm font-medium text-gray-300">
                      Category
                    </label>
                    <select
                      id="ingredientCategory"
                      value={newIngredientCategory}
                      onChange={(e) => setNewIngredientCategory(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {ingredientCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
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
                      className="mr-2 h-4 w-4"
                    >
                      <line x1="12" x2="12" y1="5" y2="19" />
                      <line x1="5" x2="19" y1="12" y2="12" />
                    </svg>
                    Add Ingredient
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
