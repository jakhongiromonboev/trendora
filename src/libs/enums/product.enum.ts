// product.enums.ts

export enum ProductCollection {
  TOPS = "TOPS", // T-shirts, hoodies, jackets
  BOTTOMS = "BOTTOMS", // Jeans, trousers, shorts
  DRESSES = "DRESSES", // Dresses
  SHOES = "SHOES", // Sneakers, boots, heels
  ACCESSORIES = "ACCESSORIES", // Bags, caps, belts, jewelry
  OTHER = "OTHER",
}

export enum ProductSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export enum ProductColor {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  BLACK = "BLACK",
  GRAY = "GRAY",
  WHITE = "WHITE",
  YELLOW = "YELLOW",
  OTHER = "OTHER",
}

export enum ProductGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNISEX = "UNISEX",
}

export enum ProductStatus {
  PAUSE = "PAUSE", // Temporarily not visible
  PROCESS = "PROCESS", // Being prepared or updated
  DELETE = "DELETE", // Soft deleted / archived
}
