export enum OrderStatus {
  PENDING = "PENDING", // Created, awaiting payment
  PAID = "PAID", // Payment confirmed
  PROCESSING = "PROCESSING", // Being prepared
  SHIPPED = "SHIPPED", // Shipped to customer
  DELIVERED = "DELIVERED", // Customer received
  CANCELED = "CANCELED", // Order canceled
}

export enum PaymentMethod {
  CARD = "CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export enum PaymentStatus {
  PENDING = "PENDING", // Payment not yet completed
  PAID = "PAID", // Payment confirmed
  FAILED = "FAILED", // Payment attempt failed
  REFUNDED = "REFUNDED", // Payment refunded
}
