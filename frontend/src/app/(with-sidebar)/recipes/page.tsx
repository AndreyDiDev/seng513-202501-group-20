"use client"

import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface Recipe {
  id: number
  title: string
  instructions: string
  Ingredients: string[]
  tags: string[]
  rating?: number
  time?: string
  calories?: number
  isFavorite?: boolean
}


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
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // State for new thread form
  const [showNewThreadForm, setShowNewThreadForm] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadCategory, setNewThreadCategory] = useState("general")
  const [newThreadContent, setNewThreadContent] = useState("")

  // Handle new thread submission
    const handleSubmitNewThread = async (e: React.FormEvent) => {
      e.preventDefault()

      const recipeID = selectedRecipe.id
  
      if (!newThreadContent.trim()) {
        alert("Please fill in all required fields")
        return
      }
  

      console.log("Posting new thread:", newThreadContent)
      console.log("recipe id", recipeID)
  
      try {
        const res = await fetch("http://localhost:5003/api/comment", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            commentText: newThreadContent,
            recipeId: recipeID
          })
        })
  
        if (!res.ok) {
          throw new Error("Failed to post comment")
        }

        setNewThreadContent("")
      } catch (error) {
        console.error("Error posting comment:", error)
        alert("Failed to post comment. Please try again.")
      }

  
      // Reset form and close it
      setNewThreadTitle("")
      setNewThreadCategory("general")
      setNewThreadContent("")
      setShowNewThreadForm(false)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const data = params.get('data')

    console.log(data)
  
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data))
        setSelectedRecipe(decoded)
      } catch (err) {
        console.error('Failed to decode recipe:', err)
      }
    }
  }, [])

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/recipe/all", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await res.json();

        console.log("recipes: ", data)
  
        // Map Ingredients array of objects to string[]
        const parsedData = data.map((recipe: any) => ({
          ...recipe,
          Ingredients: recipe.Ingredients.map((ing: { name: string }) => ing.name),
        }));

        console.log("parsed recipes: ", parsedData)
  
        setRecipes(parsedData);
      } catch (err) {
        console.error("Error loading recipes:", err);
      }
    };
  
    fetchRecipes();
  }, []);
  
  const filteredRecipes = recipes
  .filter((recipe) => {
    const name = recipe.title.toLowerCase() || ""
    const instructions = recipe.instructions.toLowerCase() || ""
    const Ingredients = recipe.Ingredients || []
    const tags = recipe.tags || []

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      instructions.includes(searchTerm.toLowerCase()) ||
      Ingredients.some((ing) => ing?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tags.some((tag) => tag?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTag = activeTag === "all" || tags.includes(activeTag)

    return matchesSearch && matchesTag
  })
  .sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating ?? 0) - (a.rating ?? 0)
    } else if (sortBy === "time") {
      const aTime = parseInt(a.time || "0")
      const bTime = parseInt(b.time || "0")
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
    router.push("/login")
  }

  return (
    <>
      <Head>
        <title>Recipes - Meal Planner</title>
        <meta name="description" content="Browse and search recipes" />
      </Head>

      <div className="flex h-screen bg-gray-900">
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
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
                  />
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
                  <ul>
                    {(filteredRecipes.find(r => r.title === selectedRecipe.title)?.Ingredients || []).map((item, idx) => (
                      <li key={idx}>{item.title || item}</li>
                    ))}
                  </ul>

                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-200 mb-2">Instructions</h3>
                    <p className="text-gray-300 whitespace-pre-line">
                      {filteredRecipes.find(r => r.title === selectedRecipe.title)?.instructions || selectedRecipe.instructions}
                    </p>

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
                      <span>{filteredRecipes.find(r => r.title === selectedRecipe.title)?.time || selectedRecipe.time}</span>
                      <span className="mx-2">•</span>
                      <span>{filteredRecipes.find(r => r.title === selectedRecipe.title)?.calories || selectedRecipe.calories} cal</span>
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

                      <button onClick={() => setShowNewThreadForm(true)}
                      className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Post a Comment
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
                      <h3 className="text-lg font-medium text-gray-100">{recipe.title}</h3>
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
                      <span>{recipe.time}</span>
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

      {/* New Thread Modal */}
      {showNewThreadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="w-full max-w-2xl rounded-md bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-100">Create New Thread</h2>
            <form onSubmit={handleSubmitNewThread}>
              <div className="mb-4">
                <label htmlFor="threadTitle" className="block text-md font-medium text-gray-300">
                  Comment on {selectedRecipe?.title}
                </label>
              </div>
              <div className="mb-4">
                <textarea
                  id="threadContent"
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Enter your thread content here..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewThreadForm(false)}
                  className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Create Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </>
  )
}
