import { connectToDatabase } from '../../../lib/mongodb';
import Budget from '../../../models/Budget';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  // Get the session
  const session = await getServerSession(req, res, authOptions);

  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectToDatabase();

  try {
    switch (req.method) {
      case 'GET':
        const { month, year } = req.query;
        const budgets = await Budget.find({ 
          month, 
          year,
          user: session.user.id 
        });
        res.status(200).json(budgets);
        break;

      case 'POST':
        // Add user ID to the budget
        const newBudget = {
          ...req.body,
          user: session.user.id
        };
        
        const budget = await Budget.create(newBudget);
        res.status(201).json(budget);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}