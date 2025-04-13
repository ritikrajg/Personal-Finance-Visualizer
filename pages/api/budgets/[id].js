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

  const { id } = req.query;

  try {
    // First, check if the budget belongs to the user
    const budget = await Budget.findOne({ 
      _id: id,
      user: session.user.id
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    switch (req.method) {
      case 'PUT':
        const updatedBudget = await Budget.findByIdAndUpdate(
          id,
          { ...req.body, user: session.user.id }, // Ensure user ID is preserved
          { new: true }
        );
        res.status(200).json(updatedBudget);
        break;

      case 'DELETE':
        await Budget.findByIdAndDelete(id);
        res.status(200).json({ message: 'Budget deleted successfully' });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}