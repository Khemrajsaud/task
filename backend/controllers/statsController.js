import User from '../models/User.js';
import Message from '../models/Message.js';

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMessages = await Message.countDocuments();
        res.json({ totalUsers, totalMessages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getDashboardStats };
