export enum MemberType {
  USER = "USER",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR", // Optional: future seller/partner
}

export enum MemberStatus {
  ACTIVE = "ACTIVE",
  BLOCK = "BLOCK",
  DELETE = "DELETE",
}

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  LOCAL = "LOCAL",
}
