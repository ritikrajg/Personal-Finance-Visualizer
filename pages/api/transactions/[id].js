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

    const { id } = req.query;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    await connectToDatabase();

    try {
        // First, check if the transaction belongs to the user
        const transaction = await Transaction.findOne({ 
            _id: id,
            user: session.user.id
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        switch (req.method) {
            case 'PUT':
                const updatedTransaction = await Transaction.findByIdAndUpdate(
                    id,
                    { ...req.body, user: session.user.id }, // Ensure user ID is preserved
                    { new: true, runValidators: true }
                );
                return res.status(200).json(updatedTransaction);

            case 'DELETE':
                const deletedTransaction = await Transaction.findByIdAndDelete(id);
                return res.status(200).json({ message: 'Transaction deleted successfully' });

            case 'GET':
                // We already fetched the transaction above
                return res.status(200).json(transaction);

            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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