export const financialData = {
  user: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    age: 32,
  },
  accounts: [
    { type: "Savings", balance: 50000, currency: "INR" },
    { type: "Checking", balance: 25000, currency: "INR" },
  ],
  investments: {
    stocks: [
      { symbol: "RELIANCE", quantity: 10, avgPrice: 2800, currentValue: 29500 },
      { symbol: "TCS", quantity: 5, avgPrice: 3800, currentValue: 19500 },
    ],
    mutualFunds: [
      { name: "Parag Parikh Flexi Cap", invested: 100000, currentValue: 125000 },
      { name: "UTI Nifty 50 Index Fund", invested: 75000, currentValue: 85000 },
    ],
    sip: [
        { name: "Mirae Asset Large Cap", amount: 5000, frequency: "monthly" }
    ]
  },
  liabilities: {
    loans: [{ type: "Personal", balance: 50000, interestRate: 12 }],
    creditCards: [{ name: "HDFC Millennia", outstanding: 15000 }],
  },
  income: [
    { source: "Salary", amount: 1200000, frequency: "annually" },
  ],
  expenses: {
    monthly: [
      { category: "Rent", amount: 25000 },
      { category: "Groceries", amount: 15000 },
      { category: "Utilities", amount: 5000 },
      { category: "Shopping", amount: 10000 },
      { category: "Entertainment", amount: 8000 },
      { category: "Transportation", amount: 4000 },
      { category: "Other", amount: 3000 },
    ],
  },
  netWorthHistory: [
    { date: "2023-01-01", value: 100000 },
    { date: "2023-04-01", value: 120000 },
    { date: "2023-07-01", value: 150000 },
    { date: "2023-10-01", value: 165000 },
    { date: "2024-01-01", value: 190000 },
    { date: "2024-04-01", value: 210000 },
  ],
  creditScore: {
    current: 780,
    history: [
      { date: "2023-01-01", score: 750 },
      { date: "2023-07-01", score: 765 },
      { date: "2024-01-01", score: 780 },
    ],
  },
};

export type FinancialData = typeof financialData;

export const getFinancialData = async (): Promise<FinancialData> => {
    // In a real app, this would be a secure API call to Fi MCP Server
    return new Promise(resolve => setTimeout(() => resolve(financialData), 500));
}
