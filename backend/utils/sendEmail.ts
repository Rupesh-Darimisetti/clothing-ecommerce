import nodemailer from 'nodemailer';
import User from '../models/User.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendOrderEmail = async (order: any, userInfo: any) => {
    // If userInfo is an id, fetch user
    let user = userInfo;
    if (typeof userInfo === 'string' || userInfo._id) {
        user = await User.findById(userInfo.id || userInfo._id);
    }

    const itemsHtml = order.items.map((item: any) =>
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
        to: user.email,
        subject: `Order Confirmation - #${order._id}`,
        html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOrderEmail;
