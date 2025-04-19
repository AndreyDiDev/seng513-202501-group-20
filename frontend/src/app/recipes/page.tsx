"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Removed Lucide React imports

// Mock user data
const mockUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/150?u=alex",
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
  const [recipes, setRecipes] = useState(mockRecipes)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { 

    const postRecipes = async () => {
  
      // separately post each recipe
      for (const recipe of recipes) {
        try {
          const response = await fetch("http://localhost:5003/api/recipe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: recipe.name,
              description: recipe.description,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
              prepTime: recipe.prepTime,
              calories: recipe.calories,
              image: recipe.image,
            }),
          })
  
        } catch (error) {
          console.error("Error posting recipe:", error)
        }
      }
    }
    
    postRecipes()
    
    const handleRetrieveRecipes = async () => {

      const ingredients = recipes.map((recipe) => recipe.ingredients).flat()
      console.log("Ingredients:", ingredients)

      try {
        const ingredients = ["tomato", "onion", "garlic"];
      
        const response = await fetch("http://localhost:5003/api/recipe", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients: ingredients }),
        });
      
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }    
    }

    handleRetrieveRecipes()
  }, [])


  // Filter and sort recipes
  const filteredRecipes = recipes
    .filter((recipe) => {
      // Filter by search term
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filter by tag
      const matchesTag = activeTag === "all" || recipe.tags.includes(activeTag)

      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "rating") {
        return b.rating - a.rating
      } else if (sortBy === "time") {
        return Number.parseInt(a.prepTime) - Number.parseInt(b.prepTime)
      } else {
        return b.id - a.id // newest first
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
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14z"></path>
                      <path d="M8 2v3"></path>
                      <path d="M16 2v3"></path>
                      <path d="M3 10h18"></path>
                      <path d="M12 15h6"></path>
                      <path d="M7 15h.01"></path>
                      <path d="M7 20h.01"></path>
                      <path d="M12 20h.01"></path>
                      <path d="M17 20h.01"></path>
                    </svg>
                    Ingredients
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recipes"
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
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/submit"
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
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
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
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
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

            {/* Recipe grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                  <div className="relative">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.name}
                      className="h-48 w-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className="absolute right-2 top-2 rounded-full bg-gray-900 bg-opacity-50 p-1.5 text-white hover:bg-opacity-70"
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
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
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
                          className="h-4 w-4 text-yellow-400"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="ml-1 text-sm font-medium text-white">{recipe.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-100">{recipe.name}</h3>
                    <p className="mt-1 text-sm text-gray-400">by {recipe.author}</p>
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
                    <div className="mt-3 flex flex-wrap gap-1">
                      {recipe.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-300 line-clamp-2">{recipe.description}</p>
                    <div className="mt-4">
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
                      >
                        View Recipe
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </main>
        </div>
      </div>
    </>
  )
}
