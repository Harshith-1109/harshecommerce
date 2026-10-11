import { useEffect } from "react"
import { Link , useParams } from "react-router"
import { PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js"
import { toast } from "react-toastify"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useDeliverOrderMutation,
    useGetOrderDetailsQuery,
    useGetPaypalClientIdQuery,
    usePayOrderMutation,
} from "../../redux/api/orderApiSlice"
import { BASE_URL } from "../../redux/features/constants" 
import { useSelector } from "react-redux"

const Order = () => {
    const {id : orderId} = useParams()
    const {data: order , refetch , isLoading , error} = useGetOrderDetailsQuery(orderId)

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();
    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal
    } = useGetPaypalClientIdQuery();

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadingPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                    },
                });
                paypalDispatch({ type: "setLoadingStatus", value: "pending" });
            };

            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadingPayPalScript();
                }
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success("Order is paid");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        });
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{ amount: { value: order.totalPrice } }],
        }).then((orderID) => {
            return orderID;
        });
    };

    const onError = (err) => {
        toast.error(err.message);
    };

    const deliverHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Order updated to delivered");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
    ) : (
        <div className="container mx-auto mt-8">
            <div className="flex flex-wrap justify-between">
                <div className="w-full md:w-2/3 pr-4">
                    <div className="border-gray-300 pb-4 mb-4">
                        <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
                        <p className="mb-4">
                            <strong>Order: </strong> {order._id}
                        </p>
                        <p className="mb-4">
                            <strong>Name: </strong> {order.user.username}
                        </p>
                        <p className="mb-4">
                            <strong>Email: </strong> {order.user.email}
                        </p>
                        <p className="mb-4">
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        <p className="mb-4">
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant="success">Paid on {order.paidAt}</Message>
                        ) : (
                            <Message variant="danger">Not Paid</Message>
                        )}
                    </div>

                    <div className="border-gray-300 pb-4 mb-4">
                        <h2 className="text-2xl font-semibold mb-2">Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-left">Image</th>
                                            <th className="p-2 text-left">Product</th>
                                            <th className="p-2 text-left">Quantity</th>
                                            <th className="p-2 text-left">Price</th>
                                            <th className="p-2 text-left">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems.map((item, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2">
                                                    <img
                                                        src={
                                                            item.image?.startsWith('http')
                                                                ? item.image
                                                                : `${BASE_URL}/${item.image?.replace(/^\/+/, '')}`
                                                        }
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
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
                    </div>
                </div>

                <div className="w-full md:w-1/3 bg-white p-4 border rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                    <ul className="space-y-2">
                        <li>
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>$ {order.itemsPrice}</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>$ {order.shippingPrice}</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>$ {order.taxPrice}</span>
                            </div>
                        </li>
                        <li>
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>$ {order.totalPrice}</span>
                            </div>
                        </li>

                        {!order.isPaid && (
                            <li>
                                {loadingPay && <Loader />}
                                {isPending ? (
                                    <Loader />
                                ) : (
                                    <div>
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </div>
                                )}
                            </li>
                        )}

                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <li>
                                <button
                                    type="button"
                                    className="bg-pink-500 text-white w-full py-2 px-4 rounded hover:bg-pink-600"
                                    onClick={deliverHandler}
                                >
                                    Mark As Delivered
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Order;