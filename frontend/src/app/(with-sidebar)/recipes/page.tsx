"use client"

import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Mock user data
const mockUser = {
  name: "Juanito Escobar",
  email: "escobar@example.com",
  isPremium: false,
}

// Mock recipes
const mockRecipes = [
  {
    id: 1,
    name: "Chicken Stir Fry",
    description: "Quick and easy chicken stir fry with vegetables and soy sauce.",
    ingredients: ["Chicken Breast", "Broccoli", "Carrots", "Soy Sauce", "Garlic", "Ginger"],
    instructions:
      "1. Cut chicken into strips. 2. Stir-fry chicken until cooked. 3. Add vegetables and stir-fry. 4. Add sauce and simmer.",
    prepTime: "25 mins",
    calories: 450,
    image: "https://source.unsplash.com/random/300x200/?stirfry",
    author: "Chef Mike",
    rating: 4.8,
    tags: ["quick", "protein", "asian"],
    isFavorite: true,
  },
  {
    id: 2,
    name: "Salmon with Quinoa",
    description: "Healthy salmon fillet with quinoa and steamed vegetables.",
    ingredients: ["Salmon", "Quinoa", "Spinach", "Lemon", "Olive Oil", "Dill"],
    instructions:
      "1. Cook quinoa according to package. 2. Season salmon and bake. 3. Steam spinach. 4. Serve salmon over quinoa with spinach.",
    prepTime: "30 mins",
    calories: 520,
    image: "https://source.unsplash.com/random/300x200/?salmon",
    author: "Chef Lisa",
    rating: 4.7,
    tags: ["healthy", "seafood", "protein"],
    isFavorite: false,
  },
  {
    id: 3,
    name: "Vegetarian Pasta Primavera",
    description: "Classic Italian pasta dish with fresh spring vegetables.",
    ingredients: ["Pasta", "Broccoli", "Bell Peppers", "Carrots", "Olive Oil", "Garlic"],
    instructions:
      "1. Cook pasta according to package. 2. Sauté vegetables in olive oil and garlic. 3. Combine pasta and vegetables. 4. Season with salt and pepper.",
    prepTime: "20 mins",
    calories: 380,
    image: "https://source.unsplash.com/random/300x200/?pasta",
    author: "Chef Maria",
    rating: 4.5,
    tags: ["vegetarian", "pasta", "quick"],
    isFavorite: true,
  },
  {
    id: 4,
    name: "Avocado Toast with Poached Egg",
    description: "Simple and nutritious breakfast with creamy avocado and poached egg.",
    ingredients: ["Bread", "Avocado", "Eggs", "Salt", "Pepper", "Red Pepper Flakes"],
    instructions:
      "1. Toast bread. 2. Mash avocado and spread on toast. 3. Poach eggs. 4. Top toast with poached eggs and season.",
    prepTime: "15 mins",
    calories: 320,
    image: "https://source.unsplash.com/random/300x200/?avocado-toast",
    author: "Chef Alex",
    rating: 4.9,
    tags: ["breakfast", "vegetarian", "quick"],
    isFavorite: false,
  },
  {
    id: 5,
    name: "Beef Tacos",
    description: "Authentic Mexican tacos with seasoned beef and fresh toppings.",
    ingredients: ["Ground Beef", "Taco Shells", "Lettuce", "Tomatoes", "Cheese", "Salsa"],
    instructions:
      "1. Brown beef and add taco seasoning. 2. Prepare toppings. 3. Fill taco shells with beef and toppings.",
    prepTime: "25 mins",
    calories: 480,
    image: "https://source.unsplash.com/random/300x200/?tacos",
    author: "Chef Carlos",
    rating: 4.6,
    tags: ["mexican", "beef", "dinner"],
    isFavorite: true,
  },
  {
    id: 6,
    name: "Mushroom Risotto",
    description: "Creamy Italian rice dish with mushrooms and parmesan.",
    ingredients: ["Arborio Rice", "Mushrooms", "Onion", "White Wine", "Vegetable Stock", "Parmesan"],
    instructions:
      "1. Sauté onions and mushrooms. 2. Add rice and toast. 3. Add wine and stock gradually, stirring. 4. Finish with parmesan.",
    prepTime: "40 mins",
    calories: 450,
    image: "https://source.unsplash.com/random/300x200/?risotto",
    author: "Chef Giovanni",
    rating: 4.7,
    tags: ["italian", "vegetarian", "dinner"],
    isFavorite: false,
  },
]

// Recipe tags for filtering
const recipeTags = [
  "all",
  "quick",
  "vegetarian",
  "protein",
  "healthy",
  "breakfast",
  "dinner",
  "italian",
  "asian",
  "mexican",
  "seafood",
]

export default function RecipesPage() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTag, setActiveTag] = useState("all")
  const [sortBy, setSortBy] = useState("rating") // rating, time, newest
  const [recipes, setRecipes] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/recipe/all", {
          method: 'GET',
          credentials: 'include',
        })
        if (!res.ok) {
          throw new Error("Failed to fetch recipes")
        }
        const data = await res.json()
        setRecipes(data)
      } catch (err) {
        console.error("Error loading recipes:", err)
      }
    }

    fetchRecipes()
  }, [])


  const filteredRecipes = recipes
  .filter((recipe) => {
    const name = recipe.name?.toLowerCase() || ""
    const description = recipe.description?.toLowerCase() || ""
    const ingredients = recipe.ingredients || []
    const tags = recipe.tags || []

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase()) ||
      ingredients.some((ing) => ing?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tags.some((tag) => tag?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTag = activeTag === "all" || tags.includes(activeTag)

    return matchesSearch && matchesTag
  })
  .sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0)
    } else if (sortBy === "time") {
      const aTime = parseInt(a.prepTime) || 0
      const bTime = parseInt(b.prepTime) || 0
      return aTime - bTime
    } else {
      return (b.id ?? 0) - (a.id ?? 0)
    }
  })

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setRecipes(
      recipes.map((recipe) => {
        if (recipe.id === id) {
          return { ...recipe, isFavorite: !recipe.isFavorite }
        }
        return recipe
      }),
    )
  }

  // Logout function
  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    router.push("/login")
  }

  return (
    <>
      <Head>
        <title>Recipes - Meal Planner</title>
        <meta name="description" content="Browse and search recipes" />
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
            <h1 className="text-lg font-semibold text-gray-100">Recipe Database</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search recipes..."
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
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <button
                className="rounded-md bg-emerald-600 p-1 text-white hover:bg-emerald-500"
                onClick={() => setShowFilters(!showFilters)}
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
                  className="h-4 w-4"
                >
                  <polygon points="22 3 2 11 11 13 22 21 22 3"></polygon>
                  <line x1="22" y1="3" x2="11" y2="13"></line>
                </svg>
              </button>
            </div>
          </header>

          {/* Content body */}
          <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
            {/* Filters */}
            {showFilters && (
              <div className="mb-6 rounded-lg bg-gray-800 p-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-300">Filter by Tag</h3>
                    <div className="flex flex-wrap gap-2">
                      {recipeTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setActiveTag(tag)}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            activeTag === tag
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {tag === "all" ? "All Recipes" : tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-300">Sort by</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy("rating")}
                        className={`flex items-center rounded-md px-3 py-1 text-xs font-medium ${
                          sortBy === "rating"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
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
                          className="mr-1 h-3 w-3"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Rating
                      </button>
                      <button
                        onClick={() => setSortBy("time")}
                        className={`flex items-center rounded-md px-3 py-1 text-xs font-medium ${
                          sortBy === "time"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
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
                          className="mr-1 h-3 w-3"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Prep Time
                      </button>
                      <button
                        onClick={() => setSortBy("newest")}
                        className={`flex items-center rounded-md px-3 py-1 text-xs font-medium ${
                          sortBy === "newest"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Newest
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Recipe Panel */}
            {selectedRecipe && (
              <div className="mb-6 rounded-lg bg-gray-800 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-100">{selectedRecipe.title}</h2>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="rounded-full bg-gray-700 p-1 text-gray-300 hover:bg-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-200 mb-2">Ingredients</h3>
                    <ul className="space-y-1 text-gray-300">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-200 mb-2">Instructions</h3>
                    <p className="text-gray-300 whitespace-pre-line">{selectedRecipe.instructions}</p>

                    <div className="mt-4 flex items-center text-sm text-gray-400">
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
                        className="mr-1 h-4 w-4"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{selectedRecipe.prepTime}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedRecipe.calories} cal</span>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => toggleFavorite(selectedRecipe.id)}
                        className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-600 mr-2"
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
                          className={`h-4 w-4 mr-1 ${selectedRecipe.isFavorite ? "fill-red-500 text-red-500" : ""}`}
                        >
                          <path d="M19.4 7.34A6 6 0 0 0 5.37 7.34"></path>
                          <path d="M12 21a9 9 0 0 0 6.21-15.81A9 9 0 0 0 5.79 5.19A9 9 0 0 0 12 21z"></path>
                        </svg>
                        {selectedRecipe.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                      </button>

                      <button className="flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500">
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
                          className="h-4 w-4 mr-1"
                        >
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Add to Meal Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recipe List */}
            <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              <div className="space-y-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="rounded-lg bg-gray-800 p-4 shadow-lg cursor-pointer hover:bg-gray-750"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-100">{recipe.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(recipe.id)
                        }}
                        className="rounded-full p-1 text-gray-300 hover:bg-gray-700"
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
                          className={`h-5 w-5 ${recipe.isFavorite ? "fill-red-500 text-red-500" : ""}`}
                        >
                          <path d="M19.4 7.34A6 6 0 0 0 5.37 7.34"></path>
                          <path d="M12 21a9 9 0 0 0 6.21-15.81A9 9 0 0 0 5.79 5.19A9 9 0 0 0 12 21z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
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
                        className="mr-1 h-4 w-4"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{recipe.prepTime}</span>
                      <span className="mx-2">•</span>
                      <span>{recipe.calories} cal</span>
                    </div>
                  </div>
                ))}

                {filteredRecipes.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-12 text-center shadow-lg">
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
                      className="h-12 w-12 text-gray-500"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-100">No recipes found</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setActiveTag("all")
                      }}
                      className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Create Recipe Button */}
            <div className="fixed bottom-6 right-6">
              <Link
                href="/submit"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
