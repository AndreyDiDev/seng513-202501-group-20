"use client"

import type React from "react"
import { useState , useEffect} from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Head from "next/head"

interface Thread { 
  id: number
  recipeTitle: string
  recipiePoster: string
  comment: string
}


export default function ForumPage () {
  const router = useRouter()
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/comment", {
          method: 'GET',
          credentials: 'include'
        }) 
        const data = await res.json()
        console.log(data)
        setThreads(data)
      } catch (err) {
        console.error("Error fetching threads:", err)
      } 
    }

    fetchThreads()
  }, [])

  // Filter and sort threads
  const filteredThreads = threads.filter((thread: Thread) => {

      // Filter by search term
      const matchesSearch =
        thread.recipeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.comment.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    }).reverse() // Reverse the order to show the most recent first
    

  return (
    <>
      <Head>
        <title>Recipe Forum - Meal Planner</title>
        <meta name="description" content="Join discussions about recipes and cooking" />
      </Head>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Content header */}
          <header className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-100">Recipe Forum</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search discussions..."
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
            </div>
          </header>

          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Categories */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-full px-4 py-1 text-sm font-medium ${
                  activeCategory === "all" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All Categories
              </button>
            </div>

            {/* Sort options */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <button
                  onClick={() => setSortBy("recent")}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    sortBy === "recent" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setSortBy("popular")}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    sortBy === "popular" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setSortBy("replies")}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    sortBy === "replies" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Most Replies
                </button>
              </div>
              <div className="text-sm text-gray-400">
                {filteredThreads.length} {filteredThreads.length === 1 ? "thread" : "threads"}
              </div>
            </div>

            {/* Thread list */}
            <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              <div className="space-y-4">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`rounded-lg bg-gray-800 p-4 shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div>
                          <Link
                            href={`/forum/thread/${thread.id}`}
                            className="text-lg font-medium text-gray-100 hover:text-emerald-400"
                          >
                            {thread.recipeTitle}
                          </Link>
                          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                            <span>By {thread.recipePoster}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-300">{thread.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {filteredThreads.length === 0 && (
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-100">No threads found</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setActiveCategory("all")
                  }}
                  className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
    </>
  )
}
