"use client"

import { useState, useEffect } from "react"
import { Star, ArrowLeft, Heart, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import type { Employee } from "@/types/employee"
import { FavoritesService } from "@/services/favorites-service"

export default function FavoritesPage() {
  const [favoriteEmployees, setFavoriteEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavoriteEmployees()
  }, [])

  const loadFavoriteEmployees = () => {
    try {
      const favorites = FavoritesService.getFavoriteEmployees()
      setFavoriteEmployees(favorites)
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = (employee: Employee) => {
    FavoritesService.toggleFavorite(employee)
    setFavoriteEmployees((prev) => prev.filter((emp) => emp.login.uuid !== employee.login.uuid))
  }

  const clearAllFavorites = () => {
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      FavoritesService.clearAllFavorites()
      setFavoriteEmployees([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">EmployeeHub</h1>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-600 font-medium hover:text-gray-900 transition-colors pb-1">
                  Home
                </Link>
                <Link
                  href="/favorites"
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors border-b-2 border-blue-600 pb-1"
                >
                  Favorites ({favoriteEmployees.length})
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Search</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                  <Heart className="w-8 h-8 text-red-500" />
                  <span>My Favorite Employees</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  {favoriteEmployees.length} saved employee{favoriteEmployees.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {favoriteEmployees.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllFavorites}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading your favorites...</p>
              </div>
            </div>
          ) : favoriteEmployees.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-600 mb-4">No favorites yet</h2>
                <p className="text-gray-500 mb-6">
                  Start building your dream team by adding employees to your favorites!
                </p>
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Employees
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Alert className="mb-8 bg-blue-50 border-blue-200">
                <Star className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Click on any employee card to view their detailed information and location.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteEmployees.map((employee) => (
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
                            className="rounded-full mx-auto object-cover border-4 border-yellow-200 group-hover:border-yellow-300 transition-colors"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=100&width=100"
                            }}
                          />
                          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                            <Star className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>

                        <h4 className="font-bold text-lg text-gray-900 mb-1">
                          {employee.name.first} {employee.name.last}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">Age: {employee.dob.age}</p>
                        <p className="text-sm text-gray-500 mb-4 truncate">
                          📍 {employee.location.city}, {employee.location.country}
                        </p>

                        <div className="flex space-x-2">
                          <Link href={`/employee/${employee.login.uuid}`} className="flex-1">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFavorite(employee)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
