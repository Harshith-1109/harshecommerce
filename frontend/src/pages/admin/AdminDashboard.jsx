import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const AdminDashboard = () => {
  const { data: users, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery();
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery();

  const totalSales = orders
    ? orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0).toFixed(2)
    : 0;

  const totalOrders = orders ? orders.length : 0;
  const totalCustomers = users ? users.length : 0;

  return (
    <div className="container mx-auto px-4 my-10">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Sales</h3>
          <p className="text-2xl font-bold mt-2">$ {totalSales}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Customers</h3>
          <p className="text-2xl font-bold mt-2">{loadingUsers ? <Loader /> : totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">{loadingOrders ? <Loader /> : totalOrders}</p>
        </div>
      </div>

      {loadingOrders || loadingProducts || loadingUsers ? (
        <Loader />
      ) : errorOrders ? (
        <Message variant="danger">{errorOrders?.data?.message || errorOrders.error}</Message>
      ) : (
        <div className="bg-white p-6 rounded shadow border">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">USER</th>
                  <th className="p-2 text-left">DATE</th>
                  <th className="p-2 text-left">TOTAL</th>
                  <th className="p-2 text-left">PAID</th>
                  <th className="p-2 text-left">DELIVERED</th>
                </tr>
              </thead>
              <tbody>
                {orders?.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.user ? order.user.username : "N/A"}</td>
                    <td className="p-2">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-2">$ {order.totalPrice}</td>
                    <td className="p-2">
                      {order.isPaid ? (
                        <span className="p-1 text-xs bg-green-400 text-black rounded">Completed</span>
                      ) : (
                        <span className="p-1 text-xs bg-red-400 text-black rounded">Pending</span>
                      )}
                    </td>
                    <td className="p-2">
                      {order.isDelivered ? (
                        <span className="p-1 text-xs bg-green-400 text-black rounded">Completed</span>
                      ) : (
                        <span className="p-1 text-xs bg-red-400 text-black rounded">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;