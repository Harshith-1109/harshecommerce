import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { BASE_URL } from "../../redux/features/constants"; 

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [qty, setQty] = useState(1);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({...product , qty}))
    navigate('/cart')
  }

  return (
    <div className="container mx-auto px-4 mt-6">
      <div>
        <Link
          to="/"
          className="text-black font-semibold hover:underline"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-start justify-between mt-[2rem]">
            <div className="relative">
              <img
  src={
    product.image?.startsWith('http')
      ? product.image
      : `${BASE_URL}/${product.image?.replace(/^\/+/, '')}`
  }
  alt={product.name}
  className="w-full xl:w-[45rem] lg:w-[40rem] md:w-[30rem] sm:w-[20rem] rounded-lg"
/>
              <HeartIcon product={product} />
            </div>

            <div className="flex flex-col justify-between flex-1 max-w-[40rem] ml-0 lg:ml-8 mt-6 lg:mt-0">
              <h2 className="text-2xl font-semibold text-black">{product.name}</h2>
              <p className="my-4 text-gray-600">
                {product.description}
              </p>

              <p className="text-5xl my-4 font-extrabold text-black">$ {product.price}</p>

              <div className="flex items-center justify-between w-full max-w-[30rem]">
                <div>
                  <h1 className="flex items-center mb-6 text-black font-semibold">
                    <FaStore className="mr-2 text-black" /> Brand:{" "}
                    <span className="font-normal ml-1">{product.brand}</span>
                  </h1>
                  <h1 className="flex items-center mb-6 text-black font-semibold">
                    <FaClock className="mr-2 text-black" /> Added:{" "}
                    <span className="font-normal ml-1">{moment(product.createdAt).fromNow()}</span>
                  </h1>
                  <h1 className="flex items-center mb-6 text-black font-semibold">
                    <FaStar className="mr-2 text-black" /> Reviews:{" "}
                    <span className="font-normal ml-1">{product.numReviews}</span>
                  </h1>
                </div>

                <div>
                  <h1 className="flex items-center mb-6 text-black font-semibold">
                    <FaStar className="mr-2 text-black" /> Ratings:{" "}
                    <span className="font-normal ml-1">{product.rating}</span>
                  </h1>
                  <h1 className="flex items-center mb-6 text-black font-semibold">
                    <FaShoppingCart className="mr-2 text-black" /> Quantity:{" "}
                    <span className="font-normal ml-1">{product.quantity}</span>
                  </h1>
                  <h1 className="flex items-center mb-6 text-black font-semibold">
                    <FaBox className="mr-2 text-black" /> In Stock:{" "}
                    <span className="font-normal ml-1">{product.countInStock}</span>
                  </h1>
                </div>
              </div>

              <div className="flex justify-between items-center flex-wrap my-4 max-w-[30rem]">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="p-2 w-[6rem] border border-gray-300 rounded-lg text-black bg-white"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container mt-4">
                <button
                onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>

          <div className="mt-[5rem] container flex flex-wrap items-start justify-between">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;