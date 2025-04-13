# Personal Finance Tracker

A modern web application for tracking personal finances, built with Next.js, MongoDB, and Tailwind CSS.

![Personal Finance Tracker](https://personal-finance-visualizer-tawny.vercel.app/)

## Features

- 💰 Track income and expenses
- 📊 Visual data representation with charts
- 📱 Responsive design that works on all devices
- 🗃️ Category-based transaction organization
- 📈 Monthly financial overview
- 🔍 Transaction history with search and filter
- 💾 Persistent data storage with MongoDB
- 👤 User authentication and personalized data

## Tech Stack

- **Frontend:**
  - [Next.js](https://nextjs.org/) - React framework for production
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [Recharts](https://recharts.org/) - Composable charting library

- **Backend:**
  - [MongoDB](https://www.mongodb.com/) - NoSQL database
  - [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
  - [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

- **Deployment:**
  - [Vercel](https://vercel.com/) - Platform for frontend deployment
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ritikrajg/Personal-Finance-Visualizer
cd Personal-Finance-Visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the setup script to create a default user and migrate existing data:
```bash
npm run setup
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `NEXTAUTH_URL`: URL of your application (for authentication)

## Project Structure

```
personal-finance-tracker/
├── components/           # React components
│   ├── Dashboard.js     # Dashboard with charts
│   ├── TransactionForm.js # Form for adding/editing transactions
│   └── TransactionList.js # List of transactions
├── lib/
│   ├── mongodb.js       # MongoDB connection utility
│   └── utils.js         # Utility functions
├── models/
│   ├── Transaction.js   # Mongoose model for transactions
│   ├── Budget.js        # Mongoose model for budgets
│   └── User.js          # Mongoose model for users
├── pages/
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication routes
│   │   ├── transactions/
│   │   │   ├── index.js
│   │   │   └── [id].js
│   │   └── budgets/
│   │       ├── index.js
│   │       └── [id].js
│   ├── auth/           # Authentication pages
│   ├── _app.js
│   └── index.js        # Main page
├── public/             # Static files
├── scripts/            # Setup and migration scripts
│   ├── setup.js
│   ├── create-default-user.js
│   ├── migrate-all.js
│   ├── migrate-transactions.js
│   └── migrate-budgets.js
├── utils/              # Utility functions
│   └── calculations.js # Financial calculations
└── styles/            # Global styles
```

## Module System

This project uses CommonJS module format for better compatibility with Node.js. All files use `require()` and `module.exports` instead of ES Modules `import` and `export` statements.

## API Routes

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in a user

### Transactions
- `GET /api/transactions` - Get all transactions for the current user
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Budgets
- `GET /api/budgets` - Get all budgets for the current user
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run setup` - Run the setup script (create default user and migrate data)
- `npm run create-user` - Create a default user if none exists
- `npm run migrate` - Migrate existing data to associate with the default user

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
