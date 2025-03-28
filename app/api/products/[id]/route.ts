// Sample product data (same as in the products route)
const products = [
  {
    id: 1,
    name: "Premium Energy Drink",
    description: "Experience the ultimate energy boost with our premium imported energy drink.",
    image: "/placeholder.svg?height=400&width=400",
    gallery: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600"
    ],
    category: "Beverages",
    origin: "USA",
    price: 350,
    stock: 120,
    active: true,
    featured: true,
    tags: ["Best Seller", "Imported from USA", "Premium Quality"],
    nutritionalInfo: {
      servingSize: "250ml",
      calories: "120",
      protein: "0g",
      carbs: "30g",
      sugar: "28g",
      fat: "0g"
    },
    ingredients: "Carbonated Water, Sucrose, Glucose, Citric Acid, Natural Flavors, Taurine, Sodium Citrate, Caffeine, Inositol, Niacinamide, Pantothenic Acid, Pyridoxine HCL, Vitamin B12",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-06-20T14:45:00Z"
  },
  {
    id: 2,
    name: "Gourmet Chocolate Cookies",
    description: "Indulge in the rich, decadent flavor of our imported Belgian chocolate cookies.",
    image: "/placeholder.svg?height=400&width=400",
    gallery: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600"
    ],
    category: "Cookies",
    origin: "Belgium",
    price: 450,
    stock: 85,
    active: true,
    featured: false,
    tags: ["New Arrival", "Imported from Belgium", "Gourmet"],
    nutritionalInfo: {
      servingSize: "30g (2 cookies)",
      calories: "150",
      protein: "2g",
      carbs: "22g",
      sugar: "12g",
      fat: "7g"
    },
    ingredients: "Belgian Chocolate (Cocoa Mass, Sugar, Cocoa Butter, Emulsifier: Soy Lecithin), Wheat Flour, Butter, Sugar, Eggs, Vanilla Extract, Baking Powder, Salt",
    createdAt: "2023-02-05T09:20:00Z",
    updatedAt: "2023-06-18T12:30:00Z"
  },
  {
    id: 3,
    name: "Organic Green Tea",
    description: "Savor the refreshing taste of our premium organic green tea, sourced directly from Japanese tea gardens.",
    image: "/placeholder.svg?height=400&width=400",
    gallery: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600"
    ],
    category: "Beverages",
    origin: "Japan",
    price: 299,
    stock: 200,
    active: true,
    featured: true,
    tags: ["Organic", "Healthy Choice", "Premium Quality"],
    nutritionalInfo: {
      servingSize: "240ml",
      calories: "0",
      protein: "0g",
      carbs: "0g",
      sugar: "0g",
      fat: "0g"
    },
    ingredients: "Organic Green Tea Leaves",
    createdAt: "2023-03-12T11:10:00Z",
    updatedAt: "2023-06-22T15:00:00Z"
  },
  {
    id: 4,
    name: "Luxury Swiss Milk Chocolate",
    description: "Experience the creamy richness of premium Swiss milk chocolate, crafted with the finest ingredients.",
    image: "/placeholder.svg?height=400&width=400",
    gallery: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600"
    ],
    category: "Chocolate",
    origin: "Switzerland",
    price: 599,
    stock: 50,
    active: true,
    featured: true,
    tags: ["Luxury", "Imported from Switzerland", "Premium Quality"],
    nutritionalInfo: {
      servingSize: "40g",
      calories: "220",
      protein: "3g",
      carbs: "23g",
      sugar: "20g",
      fat: "13g"
    },
    ingredients: "Milk Chocolate (Sugar, Cocoa Butter, Whole Milk Powder, Cocoa Mass, Lecithin (Soy), Natural Vanilla Flavor)",
    createdAt: "2023-04-08T14:30:00Z",
    updatedAt: "2023-06-19T10:45:00Z"
  }
];

// Export the products
export default products;
