import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>Error loading products</h1>;
  }

  return (
    <div className="flex justify-around">
      <div className="block">
        <div className="grid grid-cols-2">
          {data?.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <ProductCarousel/>
    </div>
  );
};

export default Header;