"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/150?u=alex",
  isPremium: false,
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

// Mock database recipes
const dbRecipes = [
  {
    id: 101,
    name: "Vegetarian Pasta Primavera",
    ingredients: ["Pasta", "Broccoli", "Bell Peppers", "Carrots", "Olive Oil", "Garlic"],
    image: "https://source.unsplash.com/random/300x200/?pasta",
    tags: ["vegetarian", "pasta", "quick"],
  },
  {
    id: 102,
    name: "Avocado Toast with Poached Egg",
    ingredients: ["Bread", "Avocado", "Eggs", "Salt", "Pepper", "Red Pepper Flakes"],
    image: "https://source.unsplash.com/random/300x200/?avocado-toast",
    tags: ["breakfast", "vegetarian", "quick"],
  },
  {
    id: 103,
    name: "Grilled Chicken Salad",
    ingredients: ["Chicken Breast", "Mixed Greens", "Tomatoes", "Cucumber", "Balsamic Vinaigrette"],
    image: "https://source.unsplash.com/random/300x200/?chicken-salad",
    tags: ["protein", "salad", "healthy"],
  },
]

export default function IngredientsPage() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<number[]>([])
  const [matchingRecipes, setMatchingRecipes] = useState<typeof dbRecipes>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [newIngredientCategory, setNewIngredientCategory] = useState("proteins")
  const [ingredients, setIngredients] = useState(mockIngredients)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Add a new state for the selected recipe and panel visibility
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof dbRecipes)[0] | null>(null)

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
      setMatchingRecipes(dbRecipes)
      return
    }
  
    // Convert selected ingredient IDs to names
    const selectedIngredientNames = selectedIngredients.map(getIngredientNameById)
  
    // Fetch matching recipes from the API
    fetch("http://localhost:5003/api/recipe", {
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
        setMatchingRecipes(data)
  
        // Extract ingredient names from returned recipes
        const availableIngredientNames = new Set<string>()
        data.forEach((recipe: (typeof dbRecipes)[0]) => {
          recipe.ingredients.forEach((ing: string) => availableIngredientNames.add(ing))
        })
  
        // Convert available ingredient names to IDs
        const availableIds = ingredients
          .filter((ing) => availableIngredientNames.has(ing.name))
          .map((ing) => ing.id)
  
        setAvailableIngredients(availableIds)
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
    // In a real app, you would handle logout logic here
    router.push("/login")
  }

  // Add a function to view recipe details
  const viewRecipeDetails = (recipe: (typeof dbRecipes)[0]) => {
    setSelectedRecipe(recipe === selectedRecipe ? null : recipe)
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

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="flex h-16 items-center justify-center border-b border-gray-700 px-6">
              <div className="flex items-center">
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

            {/* User profile */}
            <div className="border-b border-gray-700 px-6 py-4">
              <div className="flex items-center">
                <img
                  src={mockUser.avatar || "/placeholder.svg"}
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-100">{mockUser.name}</p>
                  <p className="text-xs text-gray-400">{mockUser.email}</p>
                </div>
              </div>
              {!mockUser.isPremium && (
                <div className="mt-2 rounded-md bg-gray-700 px-3 py-1 text-xs text-gray-300">
                  Free Account
                  <button className="ml-2 text-emerald-400 hover:text-emerald-300">Upgrade</button>
                </div>
              )}
              {mockUser.isPremium && (
                <div className="mt-2 rounded-md bg-emerald-900 px-3 py-1 text-xs text-emerald-100">Premium Account</div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ingredients"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                      <line x1="6" x2="18" y1="17" y2="17" />
                    </svg>
                    Ingredients
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recipes"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                      <path d="M3 5h18" />
                      <path d="M10 3h4" />
                    </svg>
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planner"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Meal Planner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/submit"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Submit Recipe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forum"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M4 21l1.5-4.5A3.5 3.5 0 0 1 9 13H15a3.5 3.5 0 0 1 3.5 3.5L20 21" />
                      <line x1="9" x2="15" y1="9" y2="9" />
                    </svg>
                    Recipe Forum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
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
                      className="mr-3 h-5 w-5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Account
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Logout button */}
            <div className="border-t border-gray-700 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
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
                  className="mr-2 h-5 w-5"
                >
                  <path d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5" />
                  <path d="M17 16l4-4-4-4" />
                  <path d="M21 12H9" />
                </svg>
                Logout
              </button>
            </div>
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
                            <h3 className="font-medium text-gray-100">{recipe.name}</h3>
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

              {selectedRecipe && (
                <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-100">{selectedRecipe.name}</h2>
                    <button onClick={() => setSelectedRecipe(null)} className="text-gray-400 hover:text-gray-300">
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
                        className="h-5 w-5"
                      >
                        <line x1="18" x2="6" y1="6" y2="18" />
                        <line x1="6" x2="18" y1="6" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Ingredients</h3>
                      <ul className="space-y-1 text-gray-300">
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-center">
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
                              className="h-4 w-4 mr-2 text-emerald-400"
                            >
                              <polyline points="9 11 12 14 22 4" />
                            </svg>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Instructions</h3>
                      <p className="text-gray-400">
                        This is a placeholder for recipe instructions. In a real application, this would contain the
                        full preparation instructions for {selectedRecipe.name}.
                      </p>

                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-300 mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedRecipe.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => {
                        // In a real app, this would add the recipe to the meal plan
                        alert(`Added ${selectedRecipe.name} to your meal plan!`)
                      }}
                      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      Add to Meal Plan
                    </button>
                  </div>
                </div>
              )}

              {/* Add new ingredient form - now at the bottom */}
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
