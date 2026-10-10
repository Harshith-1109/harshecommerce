import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();

  const { categories = [], products = [], checked = [], radio = [] } = useSelector(
    (state) => state.shop || {}
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        return (
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
        );
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [filteredProductsQuery.data, filteredProductsQuery.isLoading, priceFilter, dispatch]);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);

    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter((brand) => brand !== undefined)
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleReset = () => {
    setPriceFilter("");
    setSelectedBrand("");
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full md:w-[18rem] shadow-sm self-start">
          {/* Categories Filter */}
          <h2 className="text-center py-2 bg-pink-600 text-white rounded-full mb-4 text-sm font-bold shadow-sm">
            Filter by Categories
          </h2>

          <div className="p-2 mb-4">
            {categories?.map((c) => (
              <div key={c._id} className="mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${c._id}`}
                    checked={checked.includes(c._id)}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-600 bg-white border-2 border-gray-400 rounded focus:ring-pink-500 accent-pink-600 cursor-pointer"
                  />
                  <label
                    htmlFor={`category-${c._id}`}
                    className="ml-2.5 text-sm font-semibold text-gray-800 cursor-pointer hover:text-pink-600"
                  >
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Brands Filter */}
          <h2 className="text-center py-2 bg-pink-600 text-white rounded-full mb-4 text-sm font-bold shadow-sm">
            Filter by Brands
          </h2>

          <div className="p-2 mb-4">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-center mb-3">
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-600 bg-white border-2 border-gray-400 focus:ring-pink-500 accent-pink-600 cursor-pointer"
                />
                <label
                  htmlFor={brand}
                  className="ml-2.5 text-sm font-semibold text-gray-800 cursor-pointer hover:text-pink-600"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>

          {/* Price Filter */}
          <h2 className="text-center py-2 bg-pink-600 text-white rounded-full mb-4 text-sm font-bold shadow-sm">
            Filter by Price
          </h2>

          <div className="p-2 mb-4">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 bg-white border-2 border-pink-500 rounded-lg placeholder-gray-500 text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-600 shadow-sm"
            />
          </div>

          <div className="p-2">
            <button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg py-2.5 shadow-md transition duration-200 active:scale-95"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="p-2 w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {products?.length} Products
          </h2>
          <div className="flex flex-wrap gap-6">
            {products?.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;