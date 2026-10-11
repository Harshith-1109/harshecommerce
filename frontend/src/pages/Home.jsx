import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Message from "../components/Message";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "An error occurred"}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center px-[5rem] mt-[10rem]">
            <h1 className="text-[3rem] font-semibold">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 px-10 hover:bg-pink-700 transition duration-300"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center flex-wrap mt-[2rem]">
            {data?.products?.map((product) => (
              <div key={product._id} className="m-4">
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;