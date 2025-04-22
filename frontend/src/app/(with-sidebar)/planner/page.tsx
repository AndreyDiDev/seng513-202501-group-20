"use client"

import type React from "react"

import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"


// Define types for meal plan structure
type Meal = {
  id: number
  name: string
  image: string
} | null

type DayMeals = {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
}

type MealPlanType = {
  [key: string]: DayMeals
  monday: DayMeals
  tuesday: DayMeals
  wednesday: DayMeals
  thursday: DayMeals
  friday: DayMeals
  saturday: DayMeals
  sunday: DayMeals
}

// User data
const mockUser = {
  name: "Juanito Escobar",
  email: "escobar@example.com",
  isPremium: false,
}

// Mock meal plan data
const mockMealPlan: MealPlanType = {
  monday: {
    breakfast: {
      id: 4,
      name: "Avocado Toast with Poached Egg",
      image: "https://source.unsplash.com/random/300x200/?avocado-toast",
    },
    lunch: { id: 3, name: "Vegetarian Pasta Primavera", image: "https://source.unsplash.com/random/300x200/?pasta" },
    dinner: { id: 1, name: "Chicken Stir Fry", image: "https://source.unsplash.com/random/300x200/?stirfry" },
  },
  tuesday: {
    breakfast: {
      id: 4,
      name: "Avocado Toast with Poached Egg",
      image: "https://source.unsplash.com/random/300x200/?avocado-toast",
    },
    lunch: null,
    dinner: { id: 2, name: "Salmon with Quinoa", image: "https://source.unsplash.com/random/300x200/?salmon" },
  },
  wednesday: {
    breakfast: null,
    lunch: { id: 5, name: "Beef Tacos", image: "https://source.unsplash.com/random/300x200/?tacos" },
    dinner: { id: 6, name: "Mushroom Risotto", image: "https://source.unsplash.com/random/300x200/?risotto" },
  },
  thursday: {
    breakfast: {
      id: 4,
      name: "Avocado Toast with Poached Egg",
      image: "https://source.unsplash.com/random/300x200/?avocado-toast",
    },
    lunch: { id: 3, name: "Vegetarian Pasta Primavera", image: "https://source.unsplash.com/random/300x200/?pasta" },
    dinner: null,
  },
  friday: {
    breakfast: null,
    lunch: null,
    dinner: { id: 1, name: "Chicken Stir Fry", image: "https://source.unsplash.com/random/300x200/?stirfry" },
  },
  saturday: {
    breakfast: {
      id: 4,
      name: "Avocado Toast with Poached Egg",
      image: "https://source.unsplash.com/random/300x200/?avocado-toast",
    },
    lunch: { id: 5, name: "Beef Tacos", image: "https://source.unsplash.com/random/300x200/?tacos" },
    dinner: { id: 2, name: "Salmon with Quinoa", image: "https://source.unsplash.com/random/300x200/?salmon" },
  },
  sunday: {
    breakfast: null,
    lunch: { id: 6, name: "Mushroom Risotto", image: "https://source.unsplash.com/random/300x200/?risotto" },
    dinner: { id: 3, name: "Vegetarian Pasta Primavera", image: "https://source.unsplash.com/random/300x200/?pasta" },
  },
}

// Mock recipes for selection
const mockRecipes = [
  { id: 1, name: "Chicken Stir Fry", image: "https://source.unsplash.com/random/300x200/?stirfry" },
  { id: 2, name: "Salmon with Quinoa", image: "https://source.unsplash.com/random/300x200/?salmon" },
  { id: 3, name: "Vegetarian Pasta Primavera", image: "https://source.unsplash.com/random/300x200/?pasta" },
  { id: 4, name: "Avocado Toast with Poached Egg", image: "https://source.unsplash.com/random/300x200/?avocado-toast" },
  { id: 5, name: "Beef Tacos", image: "https://source.unsplash.com/random/300x200/?tacos" },
  { id: 6, name: "Mushroom Risotto", image: "https://source.unsplash.com/random/300x200/?risotto" },
  { id: 7, name: "Greek Salad", image: "https://source.unsplash.com/random/300x200/?greek-salad" },
  { id: 8, name: "Spaghetti Carbonara", image: "https://source.unsplash.com/random/300x200/?carbonara" },
  { id: 9, name: "Vegetable Curry", image: "https://source.unsplash.com/random/300x200/?curry" },
]

// Shopping list items
const mockShoppingList = [
  { id: 1, name: "Chicken Breast", category: "Proteins", checked: false },
  { id: 2, name: "Salmon", category: "Proteins", checked: true },
  { id: 3, name: "Pasta", category: "Grains", checked: false },
  { id: 4, name: "Avocado", category: "Fruits", checked: false },
  { id: 5, name: "Eggs", category: "Dairy", checked: true },
  { id: 6, name: "Broccoli", category: "Vegetables", checked: false },
  { id: 7, name: "Bell Peppers", category: "Vegetables", checked: false },
  { id: 8, name: "Quinoa", category: "Grains", checked: false },
  { id: 9, name: "Mushrooms", category: "Vegetables", checked: true },
  { id: 10, name: "Arborio Rice", category: "Grains", checked: false },
]

export default function PlannerPage() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mealPlan, setMealPlan] = useState<MealPlanType>(mockMealPlan)
  const [shoppingList, setShoppingList] = useState(mockShoppingList)
  const [activeDay, setActiveDay] = useState("monday")
  const [activeMeal, setActiveMeal] = useState<string | null>(null)
  const [showRecipeSelector, setShowRecipeSelector] = useState(false)
  const [newItem, setNewItem] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("Vegetables")

  // Days of the week
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  // Meal types
  const mealTypes = ["breakfast", "lunch", "dinner"]

  // Handle meal selection
  const handleSelectMeal = (day: string, meal: string) => {
    setActiveDay(day)
    setActiveMeal(meal)
    setShowRecipeSelector(true)
  }

  // Update the handleAssignRecipe function to use proper typing

  // Handle recipe assignment
  const handleAssignRecipe = (recipeId: number) => {
    if (!activeDay || !activeMeal) return

    const recipe = mockRecipes.find((r) => r.id === recipeId)
    if (!recipe) return

    setMealPlan({
      ...mealPlan,
      [activeDay]: {
        ...mealPlan[activeDay],
        [activeMeal]: recipe,
      },
    })

    setShowRecipeSelector(false)
    setActiveMeal(null)
  }

  // Update the handleRemoveMeal function to use proper typing

  // Handle meal removal
  const handleRemoveMeal = (day: string, meal: string) => {
    setMealPlan({
      ...mealPlan,
      [day]: {
        ...mealPlan[day],
        [meal]: null,
      },
    })
  }

  // Toggle shopping list item
  const toggleShoppingItem = (id: number) => {
    setShoppingList(
      shoppingList.map((item) => {
        if (item.id === id) {
          return { ...item, checked: !item.checked }
        }
        return item
      }),
    )
  }

  // Add new shopping list item
  const handleAddShoppingItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return

    const newId = Math.max(...shoppingList.map((item) => item.id)) + 1
    setShoppingList([
      ...shoppingList,
      {
        id: newId,
        name: newItem.trim(),
        category: newItemCategory,
        checked: false,
      },
    ])
    setNewItem("")
  }

  // Remove shopping list item
  const handleRemoveShoppingItem = (id: number) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id))
  }

  // Logout function
  const handleLogout = () => {
    router.push("/login/page")
  }

  return (
    <>
      <Head>
        <title>Meal Planner - Meal Planner</title>
        <meta name="description" content="Plan your meals for the week" />
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
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Content header */}
          <header className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-100">Meal Planner</h2>
            <div className="flex items-center space-x-4">
              <button className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600">
                Share Plan
              </button>
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                Print Plan
              </button>
            </div>
          </header>

          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Meal plan grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {days.map((day) => (
                <div key={day} className="rounded-md bg-gray-800 p-4 shadow-md">
                  <h3 className="mb-3 text-lg font-semibold capitalize text-gray-100">{day}</h3>
                  {mealTypes.map((meal) => (
                    <div key={meal} className="mb-3">
                      <h4 className="mb-1 text-sm font-medium capitalize text-gray-300">{meal}</h4>
                      {mealPlan[day as keyof typeof mealPlan]?.[meal] ? (
                        <div className="flex items-center justify-between rounded-md bg-gray-700 p-3">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-100">
                              {mealPlan[day as keyof typeof mealPlan]?.[meal]?.name}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveMeal(day, meal)}
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-600 hover:text-gray-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectMeal(day, meal)}
                          className="flex w-full items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
                        >
                          Add {meal}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Shopping list */}
            <div className="mt-8 rounded-md bg-gray-800 p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-100">Shopping List</h2>
              <ul>
                {shoppingList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-md bg-gray-700 px-4 py-2 text-sm text-gray-300"
                  >
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleShoppingItem(item.id)}
                        className="mr-2 h-4 w-4 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500"
                      />
                      {item.name}
                    </label>
                    <button
                      onClick={() => handleRemoveShoppingItem(item.id)}
                      className="rounded-md p-1 text-gray-400 hover:bg-gray-600 hover:text-gray-300"
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
                  </li>
                ))}
              </ul>

              {/* Add new item form */}
              <form onSubmit={handleAddShoppingItem} className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="newItem" className="block text-sm font-medium text-gray-300">
                      New Item
                    </label>
                    <input
                      type="text"
                      id="newItem"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="newItemCategory" className="block text-sm font-medium text-gray-300">
                      Category
                    </label>
                    <select
                      id="newItemCategory"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      <option>Vegetables</option>
                      <option>Fruits</option>
                      <option>Proteins</option>
                      <option>Grains</option>
                      <option>Dairy</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe selector modal */}
      {showRecipeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="rounded-md bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-100">Select a Recipe</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {mockRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleAssignRecipe(recipe.id)}
                  className="flex flex-col items-center rounded-md bg-gray-700 p-3 hover:bg-gray-600"
                >
                  <span className="text-sm text-gray-100">{recipe.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRecipeSelector(false)}
              className="mt-4 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
