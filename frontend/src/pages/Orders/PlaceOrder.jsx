import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { BASE_URL } from "../../redux/constants";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <div>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-1 py-2 text-left">Image</th>
                  <th className="px-1 py-2 text-left">Product</th>
                  <th className="px-1 py-2 text-left">Quantity</th>
                  <th className="px-1 py-2 text-left">Price</th>
                  <th className="px-1 py-2 text-left">Total</th>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <img
                        src={BASE_URL ? `${BASE_URL}${item.image}` : item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>

                    <td className="p-2">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>

                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">$ {item.price}</td>
                    <td className="p-2">$ {(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 flex justify-between flex-wrap">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
            <p className="mb-4">
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>

            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <p className="mb-4">
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>

          <div className="w-full md:w-1/3 bg-white p-4 border rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <ul className="space-y-2">
              <li>
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>$ {cart.itemsPrice}</span>
                </div>
              </li>
              <li>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$ {cart.shippingPrice}</span>
                </div>
              </li>
              <li>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$ {cart.taxPrice}</span>
                </div>
              </li>
              <li>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$ {cart.totalPrice}</span>
                </div>
              </li>

              {error && (
                <li>
                  <Message variant="danger">{error?.data?.message}</Message>
                </li>
              )}

              <li>
                <button
                  type="button"
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 disabled:opacity-50"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
                {isLoading && <Loader />}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;