import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { BASE_URL } from "../redux/features/constants";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      {cartItems.length === 0 ? (
        <div className="text-xl">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-pink-600 underline">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Cart Items List */}
          <div className="w-full md:w-[70%]">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="w-24 h-24">
                 <img
  src={
    item.image?.startsWith('http')
      ? item.image
      : `${BASE_URL}/${item.image?.replace(/^\/+/, '')}`
  }
  alt={item.name}
  className="w-full h-full object-cover rounded"
/>
                </div>

                <div className="flex-1 ml-4">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-pink-600 font-semibold"
                  >
                    {item.name}
                  </Link>
                  <div className="text-black font-bold mt-1">${item.price}</div>
                </div>

                {/* Quantity Select */}
                <div className="w-24">
                  <select
                    className="w-full p-1 border rounded text-black bg-white"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete Button */}
                <button
                  className="text-red-500 ml-4 hover:text-red-700"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash className="text-xl" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="w-full md:w-[30%] bg-gray-100 p-6 rounded-lg h-fit border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2 text-black">
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span>${cart.itemsPrice}</span>
            </div>
            <div className="flex justify-between mb-2 text-black">
              <span>Shipping:</span>
              <span>${cart.shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-4 text-black">
              <span>Tax:</span>
              <span>${cart.taxPrice}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg mb-6 text-black">
              <span>Total:</span>
              <span>${cart.totalPrice}</span>
            </div>

            <button
              className="bg-pink-600 text-white w-full py-3 rounded-lg hover:bg-pink-700 transition"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;