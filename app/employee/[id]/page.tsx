"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, StarOff, Mail, Phone, MapPin, User, Calendar, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import dynamic from "next/dynamic"
import type { Employee } from "@/types/employee"
import { EmployeeService } from "@/services/employee-service"
import { FavoritesService } from "@/services/favorites-service"

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  ),
})

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const savedFavorites = FavoritesService.getFavorites()
    setFavorites(savedFavorites)
    loadEmployeeData()
  }, [params.id])

  const loadEmployeeData = async () => {
    setLoading(true)
    setError(null)

    try {
      // First try to get from cache
      const cachedEmployee = EmployeeService.getEmployeeFromCache(params.id as string)
      if (cachedEmployee) {
        setEmployee(cachedEmployee)
        setLoading(false)
        return
      }

      // If not in cache, fetch from API
      const data = await EmployeeService.fetchEmployees("google", 50)
      const foundEmployee = data.results.find((emp: Employee) => emp.login.uuid === params.id)

      if (foundEmployee) {
        setEmployee(foundEmployee)
        EmployeeService.saveEmployeesToCache(data.results)
      } else {
        setError("Employee not found")
      }
    } catch (err) {
      setError("Failed to load employee details")
      console.error("Error loading employee:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = () => {
    if (!employee) return

    const updatedFavorites = FavoritesService.toggleFavorite(employee)
    setFavorites(updatedFavorites)
  }

  const isFavorite = employee ? favorites.includes(employee.login.uuid) : false

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading employee details...</p>
        </div>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">{error || "Employee not found"}</h2>
          <p className="text-gray-500 mb-6">The employee you're looking for might have been moved or doesn't exist.</p>
          <Button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.back()} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Employee Header Card */}
          <Card className="mb-8 bg-white shadow-lg border-0">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <Image
                    src={employee.picture.large || "/placeholder.svg"}
                    alt={`${employee.name.first} ${employee.name.last}`}
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-4 border-gray-100 shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=150&width=150"
                    }}
                  />
                  <Badge
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${
                      isFavorite ? "bg-yellow-500" : "bg-gray-500"
                    }`}
                  >
                    {isFavorite ? "Favorite" : "Not Saved"}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {employee.name.title} {employee.name.first} {employee.name.last}
                  </h1>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{employee.dob.age} years old</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-5 h-5 mr-2" />
                      <span>
                        {employee.location.city}, {employee.location.country}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={toggleFavorite}
                    className={`${
                      isFavorite
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } flex items-center space-x-2`}
                  >
                    {isFavorite ? (
                      <>
                        <Star className="w-5 h-5 fill-current" />
                        <span>Remove from Favorites</span>
                      </>
                    ) : (
                      <>
                        <StarOff className="w-5 h-5" />
                        <span>Add to Favorites</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-blue-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Address</p>
                    <p className="text-gray-600">{employee.email}</p>
                    <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
                      Send Email
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone Number</p>
                    <p className="text-gray-600">{employee.phone}</p>
                    <a href={`tel:${employee.phone}`} className="text-blue-600 hover:text-blue-700 text-sm">
                      Call Now
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Full Address</p>
                    <p className="text-gray-600">
                      {employee.location.street.number} {employee.location.street.name}
                      <br />
                      {employee.location.city}, {employee.location.state}
                      <br />
                      {employee.location.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <span>Location Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden border">
                  <Map
                    latitude={Number.parseFloat(employee.location.coordinates.latitude)}
                    longitude={Number.parseFloat(employee.location.coordinates.longitude)}
                    name={`${employee.name.first} ${employee.name.last}`}
                    address={`${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}`}
                  />
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Coordinates:</strong> {employee.location.coordinates.latitude},{" "}
                    {employee.location.coordinates.longitude}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Actions */}
          <div className="mt-8 text-center">
            <Alert className="max-w-2xl mx-auto">
              <Star className="h-4 w-4" />
              <AlertDescription>
                This employee information is sourced from our comprehensive database. All contact details are verified
                and up-to-date.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
