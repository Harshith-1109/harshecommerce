import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BASE_URL } from "../../redux/features/constants"; 

const Slider = SlickSlider.default || SlickSlider;

// Custom Black Next Arrow
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-black hover:text-gray-700 text-2xl p-2 cursor-pointer"
  >
    <FaChevronRight />
  </button>
);

// Custom Black Prev Arrow
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-black hover:text-gray-700 text-2xl p-2 cursor-pointer"
  >
    <FaChevronLeft />
  </button>
);

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 xl:block lg:block md:block">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "An unexpected error occurred"}
        </Message>
      ) : (
        <div className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block mx-auto relative">
          <Slider {...settings}>
            {products?.map(
              ({
                _id,
                image,
                name,
                price,
                description,
                brand,
                createdAt,
                numReviews,
                rating,
                quantity,
                countInStock,
              }) => (
                <div key={_id} className="outline-none">
                  <img
                    src={BASE_URL ? `${BASE_URL}${image}` : image}
                    alt={name}
                    className="w-full rounded-lg object-contain h-[30rem] bg-gray-100"
                  />

                  <div className="flex justify-between w-[20rem] mt-4">
                    <div className="one">
                      <h2 className="text-lg font-bold">{name}</h2>
                      <p className="text-pink-500 font-semibold">$ {price}</p>
                      <br />
                      <p className="w-[25rem] text-sm text-gray-600">
                        {description?.substring(0, 170)}...
                      </p>
                    </div>

                    <div className="flex justify-between w-[20rem]">
                      <div className="one">
                        <h1 className="flex items-center mb-6 w-[10rem]">
                          <FaStore className="mr-2 text-pink-500" /> Brand: {brand}
                        </h1>
                        <h1 className="flex items-center mb-6 w-[10rem]">
                          <FaClock className="mr-2 text-pink-500" /> Added:{" "}
                          {moment(createdAt).fromNow()}
                        </h1>
                        <h1 className="flex items-center mb-6 w-[10rem]">
                          <FaStar className="mr-2 text-pink-500" /> Reviews:{" "}
                          {numReviews}
                        </h1>
                      </div>

                      <div className="two">
                        <h1 className="flex items-center mb-6 w-[10rem]">
                          <FaStar className="mr-2 text-pink-500" /> Ratings:{" "}
                          {Math.round(rating)}
                        </h1>
                        <h1 className="flex items-center mb-6 w-[10rem]">
                          <FaShoppingCart className="mr-2 text-pink-500" /> Quantity:{" "}
                          {quantity}
                        </h1>
                        <h1 className="flex items-center mb-6 w-[10rem]">
                          <FaBox className="mr-2 text-pink-500" /> In Stock:{" "}
                          {countInStock}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;