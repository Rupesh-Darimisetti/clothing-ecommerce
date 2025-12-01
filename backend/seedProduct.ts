import connectDB from './config/db.ts';
import Product from './models/Product.ts';

const products = [
    { name: 'Classic White T-Shirt', description: 'Soft cotton tee', price: 19.99, image: '/images/white-tshirt.jpg', category: 'T-Shirts', sizes: ['S', 'M', 'L', 'XL'], stock: 50 },
    { name: 'Black Hoodie', description: 'Warm and stylish hoodie', price: 39.99, image: '/images/black-hoodie.jpg', category: 'Hoodies', sizes: ['M', 'L', 'XL'], stock: 30 },
    { name: 'Blue Denim Jeans', description: 'Regular fit jeans', price: 49.99, image: '/images/jeans-blue.jpg', category: 'Jeans', sizes: ['30', '32', '34', '36'], stock: 40 },
    { name: 'Red Summer Dress', description: 'Light and breezy', price: 29.99, image: '/images/red-dress.jpg', category: 'Dresses', sizes: ['S', 'M', 'L'], stock: 25 },
    { name: 'Leather Jacket', description: 'Premium quality leather', price: 89.99, image: '/images/leather-jacket.jpg', category: 'Jackets', sizes: ['M', 'L'], stock: 15 },
    { name: 'Grey Sweatpants', description: 'Comfortable fit', price: 24.99, image: '/images/sweatpants-grey.jpg', category: 'Pants', sizes: ['S', 'M', 'L', 'XL'], stock: 45 },
    { name: 'Blue Hoodie', description: 'Comfortable blue hoodie', price: 34.99, image: '/images/blue-hoodie.jpg', category: 'Hoodies', sizes: ['S', 'M', 'L'], stock: 20 },
    { name: 'Graphic Tee', description: 'Trendy graphic design', price: 22.99, image: '/images/graphic-tee.jpg', category: 'T-Shirts', sizes: ['M', 'L', 'XL'], stock: 35 },
    { name: 'Black Jeans', description: 'Slim fit jeans', price: 54.99, image: '/images/jeans-black.jpg', category: 'Jeans', sizes: ['30', '32', '34'], stock: 28 },
    { name: 'Floral Dress', description: 'Printed floral dress', price: 32.99, image: '/images/floral-dress.jpg', category: 'Dresses', sizes: ['S', 'M'], stock: 18 },
    { name: 'Winter Coat', description: 'Heavy winter coat', price: 119.99, image: '/images/winter-coat.jpg', category: 'Jackets', sizes: ['M', 'L', 'XL'], stock: 10 },
    { name: 'Cargo Pants', description: 'Utility cargo pants', price: 44.99, image: '/images/cargo-pants.jpg', category: 'Pants', sizes: ['M', 'L', 'XL'], stock: 26 },
    { name: 'Striped Tee', description: 'Striped cotton t-shirt', price: 18.99, image: '/images/striped-tee.jpg', category: 'T-Shirts', sizes: ['S', 'M', 'L'], stock: 40 },
    { name: 'Yellow Hoodie', description: 'Bright yellow hoodie', price: 37.99, image: '/images/yellow-hoodie.jpg', category: 'Hoodies', sizes: ['S', 'M', 'L', 'XL'], stock: 22 },
    { name: 'Ripped Jeans', description: 'Ripped style denim', price: 59.99, image: '/images/ripped-jeans.jpg', category: 'Jeans', sizes: ['30', '32', '34', '36'], stock: 33 },
    { name: 'Black Dress', description: 'Elegant evening dress', price: 49.99, image: '/images/black-dress.jpg', category: 'Dresses', sizes: ['S', 'M', 'L'], stock: 16 },
    { name: 'Denim Jacket', description: 'Classic denim jacket', price: 69.99, image: '/images/denim-jacket.jpg', category: 'Jackets', sizes: ['M', 'L', 'XL'], stock: 12 },
    { name: 'Chinos', description: 'Slim fit chinos', price: 39.99, image: '/images/chinos.jpg', category: 'Pants', sizes: ['30', '32', '34', '36'], stock: 29 },
    { name: 'Oversized Tee', description: 'Loose fit oversized tee', price: 21.99, image: '/images/oversized-tee.jpg', category: 'T-Shirts', sizes: ['M', 'L', 'XL'], stock: 38 },
    { name: 'Puffer Jacket', description: 'Warm puffer jacket', price: 109.99, image: '/images/puffer-jacket.jpg', category: 'Jackets', sizes: ['M', 'L'], stock: 14 }
]

const seed = async () => {
    try {
        await connectDB();
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Seeded products successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error)
        process.exit(1)
    }
}

seed();