import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import asyncHandler from "../middlewares/asyncHandler.js";
 

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        // 1. Get matching products from the database
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) }
        });

        // 2. Map over the client order items and support both 'qty' and 'quantity'
        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find(
                (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
            );

            if (!matchingItemFromDB) {
                res.status(404);
                throw new Error(`Product not found: ${itemFromClient._id}`);
            }

            const itemQty = itemFromClient.qty || itemFromClient.quantity;

            return {
                name: matchingItemFromDB.name,
                qty: itemQty, // Stored as 'qty' to match typical Mongoose order schemas
                image: matchingItemFromDB.image,
                price: matchingItemFromDB.price, // Secure backend price
                product: itemFromClient._id,
            };
        });

        // 3. Calculate prices
        const itemsPrice = dbOrderItems.reduce(
            (acc, item) => acc + item.price * item.qty, 
            0
        );

        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
        const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

        // 4. Create and save the order
        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id, // Requires authentication middleware
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }


});

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id username');
        res.json(orders); // 👈 Pass the orders array here
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserOrders = async(req,res) => {
    try {
        const orders = await Order.find({ user: req.user._id});
        res.json(orders); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const countTotalOrders = async(req,res) => {
     try {
        const totalorders = await Order.countDocuments();
        res.json({totalorders}); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}
const calculateTotalSales = async(req,res) => {
    try {
        const salesByDate = await Order.aggregate([
            {
            $match : {
                isPaid : true,
            },
           
        },
         {
                $group: {
                    _id :{
                        $dateToString :{
                            formate : "%Y-%M"
                        }
                    }
                }

            } 

        ])
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


}

const calculateTotalSalesByDate = async (req, res) => {
    try {
        const salesByDate = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
                    },
                    totalSales: { $sum: "$totalPrice" },
                },
            },
        ]);

        res.json(salesByDate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "username email"
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markOrderAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address, // Finishing line from your image
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markOrderAsDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



  

export { 
    createOrder, 
    getAllOrders, 
    getUserOrders, 
    countTotalOrders, 
    calculateTotalSales, 
    calculateTotalSalesByDate ,
    findOrderById,
    markOrderAsPaid,
    markOrderAsDelivered
};