import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BASE_URL } from "../../redux/features/constants";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  return (
    <div className="w-[280px] bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:border-pink-300 transition-all duration-300">
      <section className="relative">
        <Link to={`/product/${p?._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full h-[180px] object-cover rounded-t-xl"
            src={
              p?.image?.startsWith('http')
                ? p.image
                : `${BASE_URL}/${p?.image?.replace(/^\/+/, '')}`
            }
            alt={p?.name}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-sm font-bold text-gray-900 line-clamp-2 h-10 leading-tight">
            {p?.name}
          </h5>

          <p className="font-extrabold text-pink-600 ml-2 text-base whitespace-nowrap">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-4 font-normal text-gray-600 text-xs line-clamp-2 leading-relaxed">
          {p?.description}
        </p>

        <section className="flex justify-between items-center pt-2 border-t border-gray-100">
          <Link
            to={`/product/${p?._id}`}
            className="inline-flex items-center px-3 py-2 text-xs font-bold text-center text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 transition shadow-sm"
          >
            Read More
            <svg
              className="w-3 h-3 ml-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={22} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;