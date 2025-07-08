export const sampleFinancialData = {
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    age: 32,
  },
  accounts: [
    { type: "Savings", balance: 50000, currency: "INR", bank: "HDFC Bank" },
    { type: "Checking", balance: 25000, currency: "INR", bank: "ICICI Bank" },
    { type: "Fixed Deposit", balance: 100000, currency: "INR", bank: "SBI", maturityDate: "2025-12-31" }
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
    ],
    epf: {
        balance: 250000,
        employeeContribution: 75000,
        employerContribution: 75000
    }
  },
  liabilities: {
    loans: [
        { type: "Home", balance: 2500000, interestRate: 8.5, tenureMonths: 240 },
        { type: "Personal", balance: 50000, interestRate: 12, tenureMonths: 36 }
    ],
    creditCards: [
        { name: "HDFC Millennia", outstanding: 15000, limit: 100000 },
        { name: "Amex Platinum", outstanding: 25000, limit: 500000 }
    ],
  },
  income: [
    { source: "Salary", amount: 1200000, frequency: "annually" },
    { source: "Rental", amount: 15000, frequency: "monthly"}
  ],
  expenses: {
    monthly: [
      { category: "Rent", amount: 25000 },
      { category: "Groceries", amount: 15000 },
      { category: "Utilities", amount: 5000 },
      { category: "Shopping", amount: 10000 },
      { category: "Entertainment", amount: 8000 },
      { category: "Transportation", amount: 4000 },
      { category: "EMI", amount: 22000 },
      { category: "Other", amount: 3000 },
    ],
  },
  insurance: {
      life: {
          policy: "LIC Jeevan Anand",
          sumAssured: 5000000,
          premium: 25000,
          premiumFrequency: "annually",
          surrenderValue: 150000
      },
      health: {
          policy: "HDFC Ergo Optima Restore",
          coverage: 1000000,
          premium: 15000,
          premiumFrequency: "annually"
      }
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

export type FinancialData = typeof sampleFinancialData;

export const blankFinancialData: FinancialData = {
  user: {
    name: "",
    email: "",
    age: 0,
  },
  accounts: [],
  investments: {
    stocks: [],
    mutualFunds: [],
    sip: [],
    epf: {
        balance: 0,
        employeeContribution: 0,
        employerContribution: 0
    }
  },
  liabilities: {
    loans: [],
    creditCards: [],
  },
  income: [],
  expenses: {
    monthly: [],
  },
  insurance: {
      life: {
          policy: "",
          sumAssured: 0,
          premium: 0,
          premiumFrequency: "annually",
          surrenderValue: 0
      },
      health: {
          policy: "",
          coverage: 0,
          premium: 0,
          premiumFrequency: "annually"
      }
  },
  netWorthHistory: [],
  creditScore: {
    current: 0,
    history: [],
  },
};
