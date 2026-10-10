import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data: topProducts, isLoading: loadingTopProducts } =
    useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Navigation Tabs */}
      <section className="mr-[5rem]">
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-black ${
            activeTab === 1 ? "font-bold border-b-2 border-pink-600" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-black ${
            activeTab === 2 ? "font-bold border-b-2 border-pink-600" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-black ${
            activeTab === 3 ? "font-bold border-b-2 border-pink-600" : ""
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      {/* Tab 1: Review Form */}
      <section>
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label htmlFor="rating" className="block text-xl mb-2 text-black">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg xl:w-[40rem] text-black bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div className="my-2">
                  <label htmlFor="comment" className="block text-xl mb-2 text-black">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg xl:w-[40rem] text-black bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-black">
                Please{" "}
                <Link to="/login" className="text-pink-600 underline">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Tab 2: Reviews List */}
      <section>
        {activeTab === 2 && (
          <div>
            <div>
              {product?.reviews?.length === 0 && (
                <p className="text-black">No Reviews</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {product?.reviews?.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-100 p-4 rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[40rem] sm:w-[24rem] border border-gray-200"
                >
                  <div className="flex justify-between">
                    <strong className="text-black">{review.name}</strong>
                    <p className="text-gray-500">
                      {review.createdAt?.substring(0, 10)}
                    </p>
                  </div>
                  <p className="my-4 text-black">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Tab 3: Related Products */}
      <section>
        {activeTab === 3 && (
          <section className="ml-[4rem] flex flex-wrap gap-4">
            {loadingTopProducts ? (
              <Loader />
            ) : (
              topProducts?.map((item) => (
                <div key={item._id}>
                  <SmallProduct product={item} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;