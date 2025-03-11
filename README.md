# Personal Finance Tracker
1. Clone the repository:
```bash
git clone https://github.com/ritikrajg/Personal-Finance-Visualizer.git
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

- `MONGODB_URI`: Your MongoDB connection string

## Project Structure

```
personal-finance-tracker/
├── components/           # React components
│   ├── Dashboard.js     # Dashboard with charts
│   ├── TransactionForm.js # Form for adding/editing transactions
│   └── TransactionList.js # List of transactions
├── lib/
│   └── mongodb.js       # MongoDB connection utility
├── models/
│   └── Transaction.js   # Mongoose model for transactions
├── pages/
│   ├── api/            # API routes
│   │   └── transactions/
│   │       ├── index.js
│   │       └── [id].js
│   ├── _app.js
│   └── index.js        # Main page
├── public/             # Static files
└── styles/            # Global styles
```

## API Routes

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!


## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)
- [MongoDB Documentation](https://docs.mongodb.com/)
