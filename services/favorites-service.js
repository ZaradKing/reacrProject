export class FavoritesService {
  static FAVORITES_KEY = "favoriteEmployees"
  static FAVORITES_DATA_KEY = "favoriteEmployeesData"

  static getFavorites() {
    try {
      const favorites = localStorage.getItem(this.FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error("Error reading favorites:", error)
      return []
    }
  }

  static getFavoriteEmployees() {
    try {
      const favoritesData = localStorage.getItem(this.FAVORITES_DATA_KEY)
      return favoritesData ? JSON.parse(favoritesData) : []
    } catch (error) {
      console.error("Error reading favorite employees data:", error)
      return []
    }
  }

  static toggleFavorite(employee) {
    try {
      const favorites = this.getFavorites()
      const favoriteEmployees = this.getFavoriteEmployees()

      const isCurrentlyFavorite = favorites.includes(employee.login.uuid)

      let updatedFavorites
      let updatedFavoriteEmployees

      if (isCurrentlyFavorite) {
        // Remove from favorites
        updatedFavorites = favorites.filter((id) => id !== employee.login.uuid)
        updatedFavoriteEmployees = favoriteEmployees.filter((emp) => emp.login.uuid !== employee.login.uuid)
      } else {
        // Add to favorites
        updatedFavorites = [...favorites, employee.login.uuid]
        updatedFavoriteEmployees = [...favoriteEmployees, employee]
      }

      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updatedFavorites))
      localStorage.setItem(this.FAVORITES_DATA_KEY, JSON.stringify(updatedFavoriteEmployees))

      return updatedFavorites
    } catch (error) {
      console.error("Error toggling favorite:", error)
      return this.getFavorites()
    }
  }

  static clearAllFavorites() {
    try {
      localStorage.removeItem(this.FAVORITES_KEY)
      localStorage.removeItem(this.FAVORITES_DATA_KEY)
    } catch (error) {
      console.error("Error clearing favorites:", error)
    }
  }

  static isFavorite(employeeId) {
    const favorites = this.getFavorites()
    return favorites.includes(employeeId)
  }
}
