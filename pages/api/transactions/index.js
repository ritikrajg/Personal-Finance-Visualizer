import { connectToDatabase } from '../../../lib/mongodb';
import Transaction from '../../../models/Transaction';
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
                const transactions = await Transaction.find({ user: session.user.id })
                    .sort({ date: -1 })
                    .limit(50);
                return res.status(200).json(transactions);

            case 'POST':
                // Add user ID to the transaction
                const newTransaction = {
                    ...req.body,
                    user: session.user.id
                };
                
                const transaction = await Transaction.create(newTransaction);
                return res.status(201).json(transaction);

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
}