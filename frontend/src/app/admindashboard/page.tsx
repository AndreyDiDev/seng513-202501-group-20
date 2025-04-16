"use client"
import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock user data - fetch from API
const mockUser = {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "https://i.pravatar.cc/150?u=admin",
    isPremium: true,
    isAdmin: true,
    }

    // Mock users for admin panel
    const mockUsers = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", isPremium: false, isAdmin: false, status: "active" },
    { id: 2, name: "Sarah Williams", email: "sarah@example.com", isPremium: true, isAdmin: false, status: "active" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", isPremium: false, isAdmin: false, status: "inactive" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", isPremium: true, isAdmin: false, status: "active" },
    ]

    // Mock statistics
    const mockStats = {
    totalUsers: 1254,
    premiumUsers: 342,
    activeUsers: 876,
    totalMeals: 5432,
    totalIngredients: 1876,
    totalComments: 3245,
    }

    // Mock recent activities
    const mockActivities = [
    { id: 1, user: "Sarah Williams", action: "Generated a new meal", time: "2 minutes ago" },
    { id: 2, user: "Michael Brown", action: "Added a comment", time: "15 minutes ago" },
    { id: 3, user: "Emily Davis", action: "Saved a meal", time: "1 hour ago" },
    { id: 4, user: "Alex Johnson", action: "Added new ingredients", time: "3 hours ago" },
    { id: 5, user: "Admin User", action: "Updated system settings", time: "5 hours ago" },
    ]

    // Mock recipes
    const mockRecipes = [
    {
        id: 1,
        name: "Chicken Stir Fry",
        author: "Sarah Williams",
        createdAt: "2023-04-15",
        status: "published",
        views: 1245,
        saves: 87,
    },
    {
        id: 2,
        name: "Salmon with Quinoa",
        author: "Michael Brown",
        createdAt: "2023-04-14",
        status: "published",
        views: 876,
        saves: 54,
    },
    {
        id: 3,
        name: "Vegetarian Pasta",
        author: "Emily Davis",
        createdAt: "2023-04-13",
        status: "published",
        views: 654,
        saves: 32,
    },
    {
        id: 4,
        name: "Beef Tacos",
        author: "Alex Johnson",
        createdAt: "2023-04-12",
        status: "published",
        views: 432,
        saves: 21,
    },
    ]

    // Mock comments
    const mockComments = [
    {
        id: 1,
        mealId: 1,
        mealName: "Chicken Stir Fry",
        userId: "sarah@example.com",
        userName: "Sarah Williams",
        text: "This recipe is amazing! I added some extra vegetables and it turned out great.",
        timestamp: new Date("2023-04-15T10:30:00"),
    },
    {
        id: 2,
        mealId: 1,
        mealName: "Chicken Stir Fry",
        userId: "michael@example.com",
        userName: "Michael Brown",
        text: "I substituted chicken with tofu and it was delicious!",
        timestamp: new Date("2023-04-15T11:45:00"),
    },
    {
        id: 3,
        mealId: 2,
        mealName: "Salmon with Quinoa",
        userId: "emily@example.com",
        userName: "Emily Davis",
        text: "The cooking time was perfect. The salmon came out just right.",
        timestamp: new Date("2023-04-14T14:20:00"),
    },
    {
        id: 4,
        mealId: 3,
        mealName: "Vegetarian Pasta",
        userId: "alex@example.com",
        userName: "Alex Johnson",
        text: "I added some chili flakes for extra spice. Loved it!",
        timestamp: new Date("2023-04-13T16:10:00"),
    },
]

export default function AdminPanel() {
    // TODO: 
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("dashboard")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredUsers, setFilteredUsers] = useState(mockUsers)
    const [recipes, setRecipes] = useState(mockRecipes)
    const [comments, setComments] = useState(mockComments)
    const [users, setUsers] = useState(mockUsers)
    const [recipeSearchQuery, setRecipeSearchQuery] = useState("")
    const [commentSearchQuery, setCommentSearchQuery] = useState("")
    const [filteredRecipes, setFilteredRecipes] = useState(mockRecipes)
    const [filteredComments, setFilteredComments] = useState(mockComments)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteItemType, setDeleteItemType] = useState<"recipe" | "comment" | "user" | null>(null)
    const [deleteItemId, setDeleteItemId] = useState<number | null>(null)

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

// Filter users based on search query
useEffect(() => {
    if (searchQuery) {
    const query = searchQuery.toLowerCase()
    setFilteredUsers(
        users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)),
    )
    } else {
    setFilteredUsers(users)
    }
}, [searchQuery, users])

// Filter recipes based on search query
useEffect(() => {
    if (recipeSearchQuery) {
    const query = recipeSearchQuery.toLowerCase()
    setFilteredRecipes(
        recipes.filter(
        (recipe) => recipe.name.toLowerCase().includes(query) || recipe.author.toLowerCase().includes(query),
        ),
    )
    } else {
    setFilteredRecipes(recipes)
    }
}, [recipeSearchQuery, recipes])

// Filter comments based on search query
useEffect(() => {
    if (commentSearchQuery) {
    const query = commentSearchQuery.toLowerCase()
    setFilteredComments(
        comments.filter(
        (comment) =>
            comment.mealName.toLowerCase().includes(query) ||
            comment.userName.toLowerCase().includes(query) ||
            comment.text.toLowerCase().includes(query),
        ),
    )
    } else {
    setFilteredComments(comments)
    }
}, [commentSearchQuery, comments])

// Toggle user status
const toggleUserStatus = (userId: number) => {
    const updatedUsers = users.map((user) =>
    user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
    )
    setUsers(updatedUsers)
}

// Toggle user premium status
const toggleUserPremium = (userId: number) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, isPremium: !user.isPremium } : user))
    setUsers(updatedUsers)
}

// Toggle user admin status
const toggleUserAdmin = (userId: number) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user))
    setUsers(updatedUsers)
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

// Handle delete confirmation
const handleDeleteConfirm = () => {
    if (deleteItemType === "recipe" && deleteItemId) {
    setRecipes(recipes.filter((recipe) => recipe.id !== deleteItemId))
    } else if (deleteItemType === "comment" && deleteItemId) {
    setComments(comments.filter((comment) => comment.id !== deleteItemId))
    } else if (deleteItemType === "user" && deleteItemId) {
    setUsers(users.filter((user) => user.id !== deleteItemId))
    }
    setShowDeleteModal(false)
    setDeleteItemType(null)
    setDeleteItemId(null)
}

// Show delete confirmation modal
const showDeleteConfirmation = (type: "recipe" | "comment" | "user", id: number) => {
    setDeleteItemType(type)
    setDeleteItemId(id)
    setShowDeleteModal(true)
}

// Logout function
const handleLogout = () => {
    // TODO: logout logic here
    router.push("/admin/login")
}

return (
    <>
    <Head>
        <title>Admin Panel - Meal Planner</title>
        <meta name="description" content="Admin panel for Meal Planner" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <meta name="theme-color" content="#111827" />
    </Head>

    {/* Delete confirmation modal */}
    {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg border border-gray-700">
            <h3 className="text-lg font-medium text-gray-100">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-gray-300">
            {deleteItemType === "recipe" && "Are you sure you want to delete this recipe?"}
            {deleteItemType === "comment" && "Are you sure you want to delete this comment?"}
            {deleteItemType === "user" && "Are you sure you want to delete this user?"}
            {" This action cannot be undone."}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
            <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
            >
                Cancel
            </button>
            <button
                onClick={handleDeleteConfirm}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
                Delete
            </button>
            </div>
        </div>
        </div>
    )}

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
            className="h-6 w-6 text-red-400"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="ml-2 text-lg font-bold text-gray-100">Admin Panel</span>
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
                className="h-6 w-6 text-red-400"
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
                <span className="ml-2 text-lg font-bold text-gray-100">Admin Panel</span>
            </div>
            </div>

            {/* User profile */}
            <div className="border-b border-gray-700 px-6 py-4">
            <div className="flex items-center">
                <img
                src={mockUser.avatar || "/placeholder.svg?height=40&width=40"}
                alt="User avatar"
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=40&width=40"
                }}
                />
                <div className="ml-3">
                <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-100">{mockUser.name}</p>
                    {mockUser.isPremium && (
                    <span className="ml-2 rounded-full bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-300">
                        Premium
                    </span>
                    )}
                    {mockUser.isAdmin && (
                    <span className="ml-2 rounded-full bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-300">
                        Admin
                    </span>
                    )}
                </div>
                <p className="text-xs text-gray-400">{mockUser.email}</p>
                </div>
            </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-2">
                <li>
                <button
                    onClick={() => {
                    setActiveTab("dashboard")
                    setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                    activeTab === "dashboard"
                        ? "bg-gray-700 text-red-400"
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                    </svg>
                    Dashboard
                </button>
                </li>
                <li>
                <button
                    onClick={() => {
                    setActiveTab("recipes")
                    setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                    activeTab === "recipes"
                        ? "bg-gray-700 text-red-400"
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                    </svg>
                    Recipes
                </button>
                </li>
                <li>
                <button
                    onClick={() => {
                    setActiveTab("comments")
                    setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                    activeTab === "comments"
                        ? "bg-gray-700 text-red-400"
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
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                    </svg>
                    Comments
                </button>
                </li>
                <li>
                <button
                    onClick={() => {
                    setActiveTab("users")
                    setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                    activeTab === "users"
                        ? "bg-gray-700 text-red-400"
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                    </svg>
                    Users
                </button>
                </li>
                <li>
                <button
                    onClick={() => {
                    setActiveTab("settings")
                    setIsMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center rounded-md px-4 py-2 text-sm font-medium ${
                    activeTab === "settings"
                        ? "bg-gray-700 text-red-400"
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    </svg>
                    Settings
                </button>
                </li>
                <li>
                <Link
                    href="/dashboard/page"
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                    </svg>
                    Back to Dashboard
                </Link>
                </li>
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
            {activeTab === "dashboard" && "Admin Dashboard"}
            {activeTab === "recipes" && "Recipe Management"}
            {activeTab === "comments" && "Comment Management"}
            {activeTab === "users" && "User Management"}
            {activeTab === "settings" && "System Settings"}
            </h1>
            <div>
            {activeTab === "users" && (
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                </div>
            )}
            {activeTab === "recipes" && (
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={recipeSearchQuery}
                    onChange={(e) => setRecipeSearchQuery(e.target.value)}
                    className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                </div>
            )}
            {activeTab === "comments" && (
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search comments..."
                    value={commentSearchQuery}
                    onChange={(e) => setCommentSearchQuery(e.target.value)}
                    className="w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm placeholder-gray-400 text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                </div>
            )}
            </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 sm:p-6">
            {/* Dashboard tab */}
            {activeTab === "dashboard" && (
            <div className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-gray-800 p-4 shadow border border-gray-700">
                    <div className="flex items-center">
                    <div className="rounded-md bg-red-900/30 p-3">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                        <p className="text-2xl font-bold text-gray-100">{mockStats.totalUsers}</p>
                    </div>
                    </div>
                    <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Premium Users</span>
                        <span className="font-medium text-yellow-300">{mockStats.premiumUsers}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-700">
                        <div
                        className="h-2 rounded-full bg-yellow-500"
                        style={{ width: `${(mockStats.premiumUsers / mockStats.totalUsers) * 100}%` }}
                        ></div>
                    </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gray-800 p-4 shadow border border-gray-700">
                    <div className="flex items-center">
                    <div className="rounded-md bg-emerald-900/30 p-3">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-emerald-400"
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
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-400">Total Meals</h3>
                        <p className="text-2xl font-bold text-gray-100">{mockStats.totalMeals}</p>
                    </div>
                    </div>
                    <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Ingredients</span>
                        <span className="font-medium text-emerald-300">{mockStats.totalIngredients}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-700">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: "65%" }}></div>
                    </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gray-800 p-4 shadow border border-gray-700">
                    <div className="flex items-center">
                    <div className="rounded-md bg-blue-900/30 p-3">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-400">Total Comments</h3>
                        <p className="text-2xl font-bold text-gray-100">{mockStats.totalComments}</p>
                    </div>
                    </div>
                    <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Active Users</span>
                        <span className="font-medium text-blue-300">{mockStats.activeUsers}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-700">
                        <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(mockStats.activeUsers / mockStats.totalUsers) * 100}%` }}
                        ></div>
                    </div>
                    </div>
                </div>
                </div>

                {/* Recent activity */}
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Recent Activity</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            User
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Action
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Time
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                        {mockActivities.map((activity) => (
                        <tr key={activity.id}>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-100">{activity.user}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-300">{activity.action}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-400">{activity.time}</div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>

                {/* Admin code section */}
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Admin Code</h2>
                <div className="rounded-md bg-gray-900 p-4 font-mono text-sm text-gray-300">
                    <p>// Admin access code</p>
                    <p className="mt-2">const adminCode = "MEAL-ADMIN-2023";</p>
                    <p className="mt-2">// Use this code to grant admin privileges to users</p>
                    <p className="mt-2">// This code expires in 30 days</p>
                </div>
                <div className="mt-4">
                    <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                    Generate New Code
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* Recipes tab */}
            {activeTab === "recipes" && (
            <div className="space-y-6">
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Recipe Management</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Author
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Created
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Stats
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                        {filteredRecipes.map((recipe) => (
                        <tr key={recipe.id}>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-100">{recipe.name}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-300">{recipe.author}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-300">{recipe.createdAt}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                recipe.status === "published"
                                    ? "bg-green-900/30 text-green-300"
                                    : "bg-yellow-900/30 text-yellow-300"
                                }`}
                            >
                                {recipe.status}
                            </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-300">
                                <span className="mr-2">{recipe.views} views</span>
                                <span>{recipe.saves} saves</span>
                            </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex space-x-2">
                                <button
                                onClick={() => showDeleteConfirmation("recipe", recipe.id)}
                                className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                                >
                                Delete
                                </button>
                                <button className="rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200 hover:bg-gray-600">
                                Edit
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            )}

            {/* Comments tab */}
            {activeTab === "comments" && (
            <div className="space-y-6">
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Comment Management</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            User
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Recipe
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Comment
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Date
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                        {filteredComments.map((comment) => (
                        <tr key={comment.id}>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-100">{comment.userName}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-300">{comment.mealName}</div>
                            </td>
                            <td className="px-6 py-4">
                            <div className="text-sm text-gray-300 max-w-xs truncate">{comment.text}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-300">{formatDate(comment.timestamp)}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex space-x-2">
                                <button
                                onClick={() => showDeleteConfirmation("comment", comment.id)}
                                className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                                >
                                Delete
                                </button>
                                <button className="rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200 hover:bg-gray-600">
                                View
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            )}

            {/* Users tab */}
            {activeTab === "users" && (
            <div className="space-y-6">
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                <h2 className="mb-4 text-lg font-medium text-gray-100">User Management</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Email
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Role
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                        {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm font-medium text-gray-100">{user.name}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="text-sm text-gray-300">{user.email}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                user.status === "active"
                                    ? "bg-green-900/30 text-green-300"
                                    : "bg-red-900/30 text-red-300"
                                }`}
                            >
                                {user.status}
                            </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex space-x-1">
                                {user.isPremium && (
                                <span className="rounded-full bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-300">
                                    Premium
                                </span>
                                )}
                                {user.isAdmin && (
                                <span className="rounded-full bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-300">
                                    Admin
                                </span>
                                )}
                                {!user.isPremium && !user.isAdmin && (
                                <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
                                    User
                                </span>
                                )}
                            </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex space-x-2">
                                <button
                                onClick={() => showDeleteConfirmation("user", user.id)}
                                className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                                >
                                Delete
                                </button>
                                <button
                                onClick={() => toggleUserStatus(user.id)}
                                className={`rounded-md px-2 py-1 text-xs font-medium ${
                                    user.status === "active"
                                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                                >
                                {user.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                onClick={() => toggleUserPremium(user.id)}
                                className={`rounded-md px-2 py-1 text-xs font-medium ${
                                    user.isPremium
                                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                                }`}
                                >
                                {user.isPremium ? "Remove Premium" : "Make Premium"}
                                </button>
                                <button
                                onClick={() => toggleUserAdmin(user.id)}
                                className={`rounded-md px-2 py-1 text-xs font-medium ${
                                    user.isAdmin
                                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                                >
                                {user.isAdmin ? "Remove Admin" : "Make Admin"}
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            )}

            {/* Settings tab */}
            {activeTab === "settings" && (
            <div className="space-y-6">
                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                <h2 className="mb-4 text-lg font-medium text-gray-100">System Settings</h2>
                <form className="space-y-4">
                    <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-300">
                        Site Name
                    </label>
                    <input
                        type="text"
                        id="siteName"
                        defaultValue="Meal Planner"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    </div>
                    <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300">
                        Site Description
                    </label>
                    <textarea
                        id="siteDescription"
                        defaultValue="Plan your meals with ease"
                        rows={3}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    </div>
                    <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300">
                        Contact Email
                    </label>
                    <input
                        type="email"
                        id="contactEmail"
                        defaultValue="contact@mealplanner.com"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 px-3 py-2 text-sm text-gray-100 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    </div>
                    <div className="flex items-center">
                    <input
                        id="enableRegistration"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-300">
                        Enable User Registration
                    </label>
                    </div>
                    <div className="flex items-center">
                    <input
                        id="enableComments"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="enableComments" className="ml-2 block text-sm text-gray-300">
                        Enable Comments
                    </label>
                    </div>
                    <div className="pt-4">
                    <button
                        type="submit"
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Save Settings
                    </button>
                    </div>
                </form>
                </div>

                <div className="rounded-lg bg-gray-800 p-4 sm:p-6 shadow border border-gray-700">
                <h2 className="mb-4 text-lg font-medium text-gray-100">Maintenance</h2>
                <div className="space-y-4">
                    <div>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        Backup Database
                    </button>
                    </div>
                    <div>
                    <button className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        Clear Cache
                    </button>
                    </div>
                    <div>
                    <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                        Reset System
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
        </main>
        </div>
    </div>
    </>
)
}
