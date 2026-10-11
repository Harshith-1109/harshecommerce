import { Link } from "react-router";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { BASE_URL } from "../../redux/constants";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto px-4 my-10">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">ITEMS</th>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">USER</th>
                <th className="p-2 text-left">DATE</th>
                <th className="p-2 text-left">TOTAL</th>
                <th className="p-2 text-left">PAID</th>
                <th className="p-2 text-left">DELIVERED</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-2">
                    {order.orderItems && order.orderItems.length > 0 && (
                      <img
                        src={
                          BASE_URL
                            ? `${BASE_URL}${order.orderItems[0].image}`
                            : order.orderItems[0].image
                        }
                        alt={order.orderItems[0].name}
                        className="w-16 h-16 object-cover"
                      />
                    )}
                  </td>
                  <td className="p-2">{order._id}</td>
                  <td className="p-2">{order.user ? order.user.username : "N/A"}</td>
                  <td className="p-2">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-2">$ {order.totalPrice}</td>
                  <td className="p-2">
                    {order.isPaid ? (
                      <span className="p-1 text-xs bg-green-400 text-black rounded">
                        Completed
                      </span>
                    ) : (
                      <span className="p-1 text-xs bg-red-400 text-black rounded">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {order.isDelivered ? (
                      <span className="p-1 text-xs bg-green-400 text-black rounded">
                        Completed
                      </span>
                    ) : (
                      <span className="p-1 text-xs bg-red-400 text-black rounded">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-400 text-black px-3 py-1 rounded text-sm hover:bg-pink-500">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;