export interface Employee {
  login: {
    uuid: string
    username: string
  }
  name: {
    first: string
    last: string
    title: string
  }
  email: string
  phone: string
  picture: {
    large: string
    medium: string
    thumbnail: string
  }
  dob: {
    age: number
    date: string
  }
  location: {
    street: {
      number: number
      name: string
    }
    city: string
    state: string
    country: string
    coordinates: {
      latitude: string
      longitude: string
    }
    postcode: string | number
  }
  registered: {
    date: string
    age: number
  }
  id: {
    name: string
    value: string
  }
  nat: string
}

export interface ApiResponse {
  results: Employee[]
  info: {
    seed: string
    results: number
    page: number
    version: string
  }
}
