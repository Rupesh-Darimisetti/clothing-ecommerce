import nodemailer from 'nodemailer';
import User from '../models/User.ts';
import type { OrderItem, OrderType } from '../types/order.ts';
import type { UserType } from '../types/user.ts';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER!, pass: process.env.EMAIL_PASS! }
});

const sendOrderEmail = async (order: OrderType, userInfo: UserType) => {
    // If userInfo is an id, fetch user
    let user: UserType | null = userInfo;
    if (typeof userInfo === 'string' || userInfo._id) {
        user = await User.findById(userInfo._id);
    }

    const itemsHtml = order.items.map((item: OrderItem) =>
        `<li>${item.name} (${item.size}) x${item.qty} - ₹${item.price}</li>`
    ).join('');

    const html = `
    <h1>Thank you for your order!</h1>
    <p>Order ID: ${order._id}</p>
    <p>Date: ${new Date(order.orderDate).toLocaleString()}</p>
    <h3>Items</h3>
    <ul>${itemsHtml}</ul>
    <h2>Total: ₹${order.totalPrice}</h2>
    <p>We appreciate your business.</p>`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user?.email,
        subject: `Order Confirmation - #${order._id}`,
        html
    };

    await transporter.sendMail(mailOptions);
};

export default sendOrderEmail;
