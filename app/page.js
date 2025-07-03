"use client"

import { useState, useEffect } from "react"
import { Search, Star, StarOff, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { EmployeeService } from "@/services/employee-service"
import { FavoritesService } from "@/services/favorites-service"

export default function HomePage() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = FavoritesService.getFavorites()
    setFavorites(savedFavorites)

    // Load initial employees
    loadInitialEmployees()
  }, [])

  const loadInitialEmployees = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await EmployeeService.fetchEmployees("google")
      setEmployees(data.results)
      // Save to localStorage for offline access
      EmployeeService.saveEmployeesToCache(data.results)
    } catch (err) {
      setError("Failed to load employees. Please try again.")
      console.error("Error loading employees:", err)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await loadInitialEmployees()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await EmployeeService.fetchEmployees(searchTerm.toLowerCase().trim())
      setEmployees(data.results)
      EmployeeService.saveEmployeesToCache(data.results)
    } catch (err) {
      setError("Search failed. Please check your connection and try again.")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleFavorite = (employee) => {
    const updatedFavorites = FavoritesService.toggleFavorite(employee)
    setFavorites(updatedFavorites)
  }

  const isFavorite = (employeeId) => favorites.includes(employeeId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">EmployeeHub</h1>
              <div className="flex space-x-6">
                <Link
                  href="/"
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors border-b-2 border-blue-600 pb-1"
                >
                  Home
                </Link>
                <Link
                  href="/favorites"
                  className="text-gray-600 font-medium hover:text-gray-900 transition-colors pb-1"
                >
                  Favorites ({favorites.length})
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Team</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Search through our comprehensive employee database and discover talented professionals
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search by Company or Keyword
            </label>
            <div className="flex gap-3">
              <Input
                id="search"
                type="text"
                placeholder="Enter company name (e.g., Google, Microsoft, Apple)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-12 text-lg"
                disabled={loading}
              />
              <Button onClick={handleSearch} disabled={loading} className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {searchTerm ? `Search Results for "${searchTerm}"` : "Featured Employees"}
            </h3>
            <div className="text-sm text-gray-600">
              {employees.length} employee{employees.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {loading && initialLoad ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-lg text-gray-600">Loading employees...</p>
            </div>
          ) : employees.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No employees found</h3>
              <p className="text-gray-500">Try searching with a different company name</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {employees.map((employee) => (
                <Card
                  key={employee.login.uuid}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <Image
                          src={employee.picture.large || "/placeholder.svg"}
                          alt={`${employee.name.first} ${employee.name.last}`}
                          width={100}
                          height={100}
                          className="rounded-full mx-auto object-cover border-4 border-gray-100 group-hover:border-blue-200 transition-colors"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(employee)}
                          className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow-md hover:shadow-lg"
                        >
                          {isFavorite(employee.login.uuid) ? (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                      </div>

                      <h4 className="font-bold text-lg text-gray-900 mb-1">
                        {employee.name.first} {employee.name.last}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">Age: {employee.dob.age}</p>
                      <p className="text-sm text-gray-500 mb-4 truncate">
                        📍 {employee.location.city}, {employee.location.country}
                      </p>

                      <Link href={`/employee/${employee.login.uuid}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                          More Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
