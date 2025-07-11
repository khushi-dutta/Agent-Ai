# FinGenie: Your Smart Financial AI

FinGenie is an intelligent personal finance dashboard designed to give users a complete, AI-powered overview of their financial life. It connects real-time structured financial data from 18+ trusted sources and delivers smart, contextual financial insights powered by Google’s Gemini via Genkit.

With FinGenie, you can chat with your finances, simulate your future, track your goals, and take control of your wealth — all in a secure, interactive, and personalized interface.


## 💡Why FinGenie?

Traditional finance apps offer generic tools that don’t understand your unique situation. FinGenie solves this by securely integrating with Fi Money’s Model Context Protocol (MCP), which aggregates your real financial data — assets, liabilities, credit score, EPF, SIPs — and feeds it into an intelligent Gemini-powered AI engine.

Now your financial assistant knows you — and helps you like a pro.


## ✅ Key Features

- **Comprehensive Dashboard**  
  Track your net worth, monthly income, expenses, and credit score with beautifully designed charts and summary cards.

- **MCP-Powered Personalization**  
  All insights are based on real, verified financial data securely fetched via Fi’s MCP.

- **Gemini-Powered Financial Assistant**  
  Ask natural-language questions like “How much did I spend last month?” and get personalized responses instantly.

- **Voice-Based Chat Assistant**  
  Talk to your finances! Get spoken or written answers on demand.

- **Smart Insights**  
  AI flags unusual activity, suggests improvements, and categorizes financial insights as warnings, wins, or opportunities.

- **Financial Projections**  
  Simulate “what if” scenarios — see your net worth in 10 years if you invest more or reduce expenses.

- **Goal Tracking**  
  Create and track custom financial goals like saving for a trip, a car, or a home down payment.

- **Detailed Analytics**  
  Visualize asset allocation, liabilities, SIPs, and credit score trends.

- **Full Data Control**  
  View, edit, or export your data as CSV or raw JSON. You own your data.

- **Security & Privacy**  
  Firebase Auth ensures secure login; your financial data is token-protected and never stored unencrypted.



## 🛠 Tech Stack

| Layer         | Technology                              |
|---------------|------------------------------------------|
| Framework     | Next.js (App Router)                    |
| Language      | TypeScript                              |
| Styling       | Tailwind CSS + shadcn/ui                |
| AI            | Google’s Genkit + Gemini                |
| Data Layer    | Fi Money’s MCP (Model Context Protocol) |
| Backend       | Firebase (Auth, Firestore, Cloud Functions) |
| Charts        | Recharts                                |
| Forms         | React Hook Form + Zod                   |



## 🔁 Application Flow

1. User logs in securely via Firebase Authentication  
2. MCP API fetches structured financial data  
3. Data is passed to Gemini via Genkit for context-aware processing  
4. Dashboard displays charts, projections, and insights  
5. Users interact with chat/voice assistant or simulate goals  
6. All data is stored securely and exportable anytime





## 📤 Data Privacy
- No financial credentials are stored

- All sensitive operations are authenticated via Firebase

- Users have complete control over export and deletion of data

## ✨ Future Enhancements
- Multilingual support (Hindi, Tamil, etc.)

- Notification engine for monthly summaries

- Shared family goals

- Tax-saving recommendations

## 🤝 Acknowledgements
- Fi Money for the MCP API and data infrastructure

- Google Genkit + Gemini for powering the AI agent

- Firebase for hosting, authentication & secure data handling

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
