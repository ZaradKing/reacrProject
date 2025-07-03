export class EmployeeService {
  static CACHE_KEY = "employeesCache"
  static CACHE_EXPIRY_KEY = "employeesCacheExpiry"
  static CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  static async fetchEmployees(seed = "google", results = 10) {
    try {
      const response = await fetch(
        `https://randomuser.me/api/?results=${results}&seed=${seed}&inc=login,name,email,phone,picture,dob,location,registered,id,nat`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Validate the response
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid API response format")
      }

      return data
    } catch (error) {
      console.error("Error fetching employees:", error)

      // Try to return cached data as fallback
      const cachedData = this.getCachedEmployees()
      if (cachedData.length > 0) {
        return {
          results: cachedData,
          info: {
            seed,
            results: cachedData.length,
            page: 1,
            version: "1.4",
          },
        }
      }

      throw error
    }
  }

  static saveEmployeesToCache(employees) {
    try {
      const cacheData = {
        employees,
        timestamp: Date.now(),
      }
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData))
      localStorage.setItem(this.CACHE_EXPIRY_KEY, (Date.now() + this.CACHE_DURATION).toString())
    } catch (error) {
      console.error("Error saving to cache:", error)
    }
  }

  static getCachedEmployees() {
    try {
      const expiry = localStorage.getItem(this.CACHE_EXPIRY_KEY)
      if (!expiry || Date.now() > Number.parseInt(expiry)) {
        // Cache expired
        this.clearCache()
        return []
      }

      const cached = localStorage.getItem(this.CACHE_KEY)
      if (!cached) return []

      const cacheData = JSON.parse(cached)
      return cacheData.employees || []
    } catch (error) {
      console.error("Error reading from cache:", error)
      return []
    }
  }

  static getEmployeeFromCache(id) {
    const cachedEmployees = this.getCachedEmployees()
    return cachedEmployees.find((emp) => emp.login.uuid === id) || null
  }

  static clearCache() {
    try {
      localStorage.removeItem(this.CACHE_KEY)
      localStorage.removeItem(this.CACHE_EXPIRY_KEY)
    } catch (error) {
      console.error("Error clearing cache:", error)
    }
  }
}
