import { Link } from "react-router";
import HeartIcon from "./HeartIcon";
import { BASE_URL } from "../../redux/features/constants";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative">
        <img
  src={
    product.image?.startsWith('http')
      ? product.image
      : `${BASE_URL}/${product.image?.replace(/^\/+/, '')}`
  }
  alt={product.name}
  className="h-auto w-full rounded"
/>
        <HeartIcon product={product}/>

        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h2 className="flex justify-between items-center">
              <div>{product.name}</div>
              <span className="bg-pink-800 text-pink-100 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                ${product.price}
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;