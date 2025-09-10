const userSchema = {
  uid: String,          // User ID
  name: String,         // User's name
  email: String,        // User's email
  isPremium: Boolean,   // Premium status
  premiumUntil: Date,   // Subscription end date
  createdAt: Date,      // Account creation date
  settings: {
    currency: String,   // USD, EUR, etc.
    theme: String,      // light/dark
    notifications: Boolean
  },
  transactions: [
    {
      id: String,
      amount: Number,
      type: String,     // income/expense
      category: String,
      description: String,
      date: Date
    }
  ],
  budgets: [
    {
      category: String,
      limit: Number,
      period: String,   // monthly/weekly
      currentSpent: Number
    }
  ],
  goals: [
    {
      id: String,
      name: String,
      targetAmount: Number,
      currentAmount: Number,
      deadline: Date,
      category: String
    }
  ]
}
