const express = require('express');
const router = express();

const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const ContactUs = require('../models/ContactUs');

router.post('/api/admin/checkout', async (req, res) => {
    try {
        const { totalQty, totalCost, items, user } = req.body;
        // console.log(items);
        const checkout = new Checkout({
            totalQty,
            totalCost,
            items,
            user
        });
        await checkout.save();
        for (const item of items) {
            await Product.updateOne(
                { _id: item.productId },
                { $inc: { sold: item.qty } }
            );
        }
        res.status(201).json({ message: 'Checkout successful', checkout });
        await Cart.deleteMany({ user: user });
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/admin/orders', async (req, res) => {
    try {
        const checkouts = await Checkout.find();
        res.status(200).json(checkouts);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/admin/messages', async (req, res) => {
    try {
        const messages = await ContactUs.find({});
        // console.log(messages);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/api/admin/contactUs/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const deletedMessage = await ContactUs.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;