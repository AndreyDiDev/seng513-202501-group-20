"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock user data - fetch from API
const mockUser = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/150?u=alex",
  isPremium: false,
  isAdmin: false,
}

// Mock ingredients categories
const ingredientCategories = [
  { id: "proteins", name: "Proteins", color: "bg-red-900/30 text-red-300" },
  { id: "vegetables", name: "Vegetables", color: "bg-green-900/30 text-green-300" },
  { id: "fruits", name: "Fruits", color: "bg-yellow-900/30 text-yellow-300" },
  { id: "grains", name: "Grains", color: "bg-amber-900/30 text-amber-300" },
  { id: "dairy", name: "Dairy", color: "bg-blue-900/30 text-blue-300" },
  { id: "spices", name: "Spices", color: "bg-purple-900/30 text-purple-300" },
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
]

// Mock generated meals
const mockGeneratedMeals = [
  {
    id: 1,
    name: "Chicken Stir Fry",
    ingredients: ["Chicken Breast", "Broccoli", "Carrots", "Rice"],
    instructions:
      "1. Cook rice according to package instructions.\n2. Sauté chicken until cooked through.\n3. Add vegetables and stir fry until tender-crisp.\n4. Serve over rice.",
    prepTime: "25 mins",
    calories: 450,
    image: "https://source.unsplash.com/random/300x200/?stirfry",
  },
  {
    id: 2,
    name: "Salmon with Quinoa",
    ingredients: ["Salmon", "Quinoa", "Spinach", "Lemon"],
    instructions:
      "1. Cook quinoa according to package instructions.\n2. Season salmon and bake at 400°F for 12-15 minutes.\n3. Sauté spinach until wilted.\n4. Serve salmon over quinoa with spinach and lemon wedges.",
    prepTime: "30 mins",
    calories: 520,
    image: "https://source.unsplash.com/random/300x200/?salmon",
  },
]

// Comment type definition
type Comment = {
  id: number
  mealId: number
  mealName: string
  userId: string
  userName: string
  userAvatar: string
  text: string
  timestamp: Date
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("ingredients")
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])
  const [generatedMeals, setGeneratedMeals] = useState(mockGeneratedMeals)
  const [savedMeals, setSavedMeals] = useState<typeof mockGeneratedMeals>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [newIngredientCategory, setNewIngredientCategory] = useState("proteins")
  const [ingredients, setIngredients] = useState(mockIngredients)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentingOnMeal, setCommentingOnMeal] = useState<number | null>(null)
  const [showCommentForm, setShowCommentForm] = useState<number | null>(null)
  const [user, setUser] = useState(mockUser)
  const [showPremiumSuccess, setShowPremiumSuccess] = useState(false)

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Filter ingredients by category
  const filteredIngredients =
    activeCategory === "all" ? ingredients : ingredients.filter((ingredient) => ingredient.category === activeCategory)

  // Handle ingredient selection
  const toggleIngredient = (id: number) => {
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== id))
    } else {
      setSelectedIngredients([...selectedIngredients, id])
    }
  }

  // TODO: Add new ingredient
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

  // TODO: Generate meals based on selected ingredients
  const generateMeals = () => {
    setIsGenerating(true)

    // call API here
    setTimeout(() => {
      // call API, generate meals based on the selected ingredients
      setGeneratedMeals(mockGeneratedMeals)
      setActiveTab("generated")
      setIsGenerating(false)
    }, 1500)
  }

  // TODO: Save meal to database
  const saveMeal = (meal: (typeof mockGeneratedMeals)[0]) => {
    // Check if the meal is already saved
    const isMealSaved = savedMeals.some((savedMeal) => savedMeal.id === meal.id)

    if (!isMealSaved) {
      // call API to save the meal
      setSavedMeals([...savedMeals, meal])
      alert(`Meal "${meal.name}" saved successfully!`)
    } else {
      alert(`Meal "${meal.name}" is already saved!`)
    }
  }

  // Toggle comment form
  const toggleCommentForm = (mealId: number) => {
    if (showCommentForm === mealId) {
      setShowCommentForm(null)
    } else {
      setShowCommentForm(mealId)
      setCommentingOnMeal(mealId)
      setNewComment("")
    }
  }

  // TODO: Add comment
  const addComment = (mealId: number, mealName: string) => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        mealId,
        mealName,
        userId: user.email,
        userName: user.name,
        userAvatar: user.avatar,
        text: newComment.trim(),
        timestamp: new Date(),
      }
      setComments([...comments, comment])
      setNewComment("")
      setShowCommentForm(null)

      // Show a success message
      alert("Your comment has been posted to the forum!")
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Handle premium subscription
  const handleBuyPremium = () => {
    // TODO: update the user state
    setUser({
      ...user,
      isPremium: true,
    })
    setShowPremiumSuccess(true)

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowPremiumSuccess(false)
    }, 5000)
  }

  // Logout function
  const handleLogout = () => {
    // TODO: handle logout logic here
    //router.push("/login/page")
  }

  return (
    <>
      <Head>
        <title>Dashboard - Meal Planner</title>
        <meta name="description" content="Your meal planner dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <meta name="theme-color" content="#111827" />
      </Head>

      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Mobile menu button */}
        <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center bg-gray-800 px-4 shadow-md lg:hidden border-b border-gray-700">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-300 hover:bg-gray-700"
            aria-label="Toggle menu"
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
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out border-r border-gray-700 lg:relative lg:translate-x-0 ${
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
                  src={user.avatar || "/placeholder.svg?height=40&width=40"}
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=40&width=40"
                  }}
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-100">{user.name}</p>
                    {user.isPremium && (
                      <span className="ml-2 rounded-full bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-300">
                        Premium
                      </span>
                    )}
                    {user.isAdmin && (
                      <span className="ml-2 rounded-full bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-300">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("ingredients")
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                      activeTab === "ingredients"
                        ? "bg-gray-700 text-emerald-400"
                        : "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                    }`}
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
                    Ingredients
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("generated")
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                      activeTab === "generated"
                        ? "bg-gray-700 text-emerald-400"
                        : "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                    }`}
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Generated Meals
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("saved")
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                      activeTab === "saved"
                        ? "bg-gray-700 text-emerald-400"
                        : "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                    }`}
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
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    Saved Meals
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("forum")
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                      activeTab === "forum"
                        ? "bg-gray-700 text-emerald-400"
                        : "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                    }`}
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
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                    Recipe Forum
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("account")
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                      activeTab === "account"
                        ? "bg-gray-700 text-emerald-400"
                        : "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                    }`}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Account
                  </button>
                </li>
                {user.isAdmin && (
                  <li>
                    <Link
                      href="/admin/page"
                      className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Logout button */}
            <div className="border-t border-gray-700 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
          {/* Content header */}
          <header className="flex h-16 items-center justify-between border-b border-gray-700 bg-gray-800 px-4 sm:px-6">
            <h1 className="text-lg font-semibold text-gray-100">
              {activeTab === "ingredients" && "Select Ingredients"}
              {activeTab === "generated" && "Generated Meals"}
              {activeTab === "saved" && "Saved Meals"}
              {activeTab === "forum" && "Recipe Forum"}
              {activeTab === "account" && "Account Settings"}
            </h1>
            <div>
              {activeTab === "ingredients" && selectedIngredients.length > 0 && (
                <button
                  onClick={generateMeals}
                  disabled={isGenerating}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                      Generating...
                    </span>
                  ) : (
                    "Generate Meals"
                  )}
                </button>
              )}
            </div>
          </header>

          {/* Content body */}
          <main className="flex-1 overflow-y-auto bg-gray-900 p-4 sm:p-6">
            {/* Ingredients tab */}
            {activeTab === "ingredients" && (
              <div className="space-y-6">
                {/* Add new ingredient form */}
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                  <h2 className="mb-4 text-lg font-medium text-gray-100">Add New Ingredient</h2>
                  <form
                    onSubmit={handleAddIngredient}
                    className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        placeholder="Enter ingredient name"
                        className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="w-full sm:w-1/3">
                      <select
                        value={newIngredientCategory}
                        onChange={(e) => setNewIngredientCategory(e.target.value)}
                        className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      Add Ingredient
                    </button>
                  </form>
                </div>

                {/* Ingredient categories */}
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
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
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                  <h2 className="mb-4 text-lg font-medium text-gray-100">Select Ingredients</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredIngredients.map((ingredient) => {
                      const category = ingredientCategories.find((c) => c.id === ingredient.category)
                      return (
                        <div
                          key={ingredient.id}
                          onClick={() => toggleIngredient(ingredient.id)}
                          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                            selectedIngredients.includes(ingredient.id)
                              ? "border-emerald-500 bg-gray-700"
                              : "border-gray-700 hover:border-emerald-500 hover:bg-gray-700/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-100">{ingredient.name}</span>
                            <span className={`rounded-full px-2 py-1 text-xs ${category?.color}`}>
                              {category?.name}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Generated meals tab */}
            {activeTab === "generated" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {generatedMeals.map((meal) => (
                    <div key={meal.id} className="overflow-hidden rounded-lg bg-gray-800 shadow border border-gray-700">
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-100">{meal.name}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {meal.prepTime}
                          <span className="mx-2">•</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {meal.calories} cal
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-100">Ingredients:</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {meal.ingredients.map((ingredient, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-gray-700 px-2 py-1 text-xs font-medium text-emerald-300"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-100">Instructions:</h4>
                          <p className="text-sm text-gray-300 whitespace-pre-line">{meal.instructions}</p>
                        </div>
                        <div className="mt-6 space-y-3">
                          <button
                            onClick={() => saveMeal(meal)}
                            className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                          >
                            Save Meal
                          </button>
                          <button
                            onClick={() => toggleCommentForm(meal.id)}
                            className="flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            Add Comment
                          </button>

                          {/* Comment form */}
                          {showCommentForm === meal.id && (
                            <div className="mt-4 rounded-md border border-gray-600 bg-gray-700 p-3">
                              <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts about this recipe..."
                                className="mb-2 w-full rounded-md bg-gray-800 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                rows={3}
                              ></textarea>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setShowCommentForm(null)}
                                  className="rounded-md px-3 py-1 text-xs font-medium text-gray-300 hover:text-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => addComment(meal.id, meal.name)}
                                  className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                                >
                                  Post Comment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved meals tab */}
            {activeTab === "saved" && (
              <div className="space-y-6">
                {savedMeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-12 text-center shadow border border-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-100">No saved meals yet</h3>
                    <p className="mt-2 text-sm text-gray-400">Generate meals and save them to see them here.</p>
                    <button
                      onClick={() => setActiveTab("ingredients")}
                      className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      Select Ingredients
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {savedMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="overflow-hidden rounded-lg bg-gray-800 shadow border border-gray-700"
                      >
                        <div className="p-4 sm:p-6">
                          <h3 className="text-lg font-medium text-gray-100">{meal.name}</h3>
                          <div className="mt-2 flex items-center text-sm text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {meal.prepTime}
                            <span className="mx-2">•</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            {meal.calories} cal
                          </div>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-100">Ingredients:</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {meal.ingredients.map((ingredient, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-full bg-gray-700 px-2 py-1 text-xs font-medium text-emerald-300"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-gray-100">Instructions:</h4>
                            <p className="text-sm text-gray-300 whitespace-pre-line">{meal.instructions}</p>
                          </div>
                          <div className="mt-6 flex space-x-2">
                            <button
                              onClick={() => {
                                const updatedSavedMeals = savedMeals.filter((savedMeal) => savedMeal.id !== meal.id)
                                setSavedMeals(updatedSavedMeals)
                                alert(`Meal "${meal.name}" removed from saved meals.`)
                              }}
                              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                              Remove
                            </button>
                            <button className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "forum" && (
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800 p-12 text-center shadow border border-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-100">No comments yet</h3>
                    <p className="mt-2 text-sm text-gray-400">Be the first to comment on a recipe!</p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                    <h2 className="mb-4 text-lg font-medium text-gray-100">Recipe Forum</h2>
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg bg-gray-700 p-4 shadow border border-gray-600">
                          <div className="flex items-start space-x-4">
                            <img
                              src={comment.userAvatar || "/placeholder.svg?height=40&width=40"}
                              alt={`${comment.userName}'s avatar`}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=40&width=40"
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-100">{comment.userName}</h3>
                                <span className="text-xs text-gray-400">{formatDate(comment.timestamp)}</span>
                              </div>
                              <p className="mt-1 text-sm text-gray-300">{comment.text}</p>
                              <div className="mt-2 text-xs text-gray-400">
                                <span>On recipe: {comment.mealName}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Premium subscription section */}
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                  <h2 className="mb-4 text-lg font-medium text-gray-100">Premium Subscription</h2>

                  {showPremiumSuccess && (
                    <div className="mb-4 rounded-md bg-emerald-900/30 border border-emerald-800 p-3">
                      <p className="text-sm text-emerald-300">
                        <span className="font-bold">Success!</span> You are now a premium member. Enjoy all the
                        benefits!
                      </p>
                    </div>
                  )}

                  {user.isPremium ? (
                    <div className="rounded-md bg-gray-700 p-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-yellow-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                        <div className="ml-4">
                          <h3 className="text-md font-medium text-gray-100">Premium Member</h3>
                          <p className="text-sm text-gray-300">You're enjoying all premium features!</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-100">Your Premium Benefits:</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-300">
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-4 w-4 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Unlimited meal generations
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-4 w-4 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Advanced nutrition tracking
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-4 w-4 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Exclusive premium recipes
                          </li>
                          <li className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-4 w-4 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Priority customer support
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="rounded-md bg-gray-700 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-100">Upgrade to Premium</h3>
                            <p className="mt-1 text-sm text-gray-300">
                              Get unlimited meal generations, advanced nutrition tracking, and more!
                            </p>
                            <ul className="mt-3 space-y-1 text-sm text-gray-300">
                              <li className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4 text-emerald-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Unlimited meal generations
                              </li>
                              <li className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4 text-emerald-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Advanced nutrition tracking
                              </li>
                              <li className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 h-4 w-4 text-emerald-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Exclusive premium recipes
                              </li>
                            </ul>
                          </div>
                          <div className="mt-4 sm:mt-0">
                            <span className="block text-center text-2xl font-bold text-gray-100">$9.99</span>
                            <span className="block text-center text-xs text-gray-400">per month</span>
                            <button
                              onClick={handleBuyPremium}
                              className="mt-2 w-full rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                              Upgrade Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                  <h2 className="mb-4 text-lg font-medium text-gray-100">Account Information</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <img
                      src={user.avatar || "/placeholder.svg?height=80&width=80"}
                      alt="User avatar"
                      className="h-20 w-20 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=80&width=80"
                      }}
                    />
                    <div className="mt-4 sm:mt-0 sm:ml-6">
                      <h3 className="text-lg font-medium text-gray-100">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <button className="mt-2 rounded-md bg-gray-700 px-3 py-1 text-xs font-medium text-emerald-300 hover:bg-gray-600">
                        Change Avatar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                  <h2 className="mb-4 text-lg font-medium text-gray-100">Personal Information</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          defaultValue="Alex"
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          defaultValue="Johnson"
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue={user.email}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Change Password */}
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                  <h2 className="mb-4 text-lg font-medium text-gray-100">Change Password</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
