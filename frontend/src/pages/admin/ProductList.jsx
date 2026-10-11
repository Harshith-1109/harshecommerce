import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

import { 
    useCreateProductMutation,
    useUploadProductImageMutation 
} from "../../redux/api/productApiSlice"
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { BASE_URL } from "../../redux/constants";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
   const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState('')
    const [brand, setBrand] = useState('')
    const [stock, setStock] = useState(0)
    const [imageUrl, setImageUrl] = useState(null)
    const navigate = useNavigate()

    const [uploadProductImage] = useUploadProductImageMutation()
    const [createProduct] = useCreateProductMutation()
    const { data: categories } = useFetchCategoriesQuery()

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(e.target.files[0]);
            setImageUrl(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append('image', imageUrl);
            productData.append('name', name);
            productData.append('description', description);
            productData.append('price', price);
            productData.append('category', category);
            productData.append('quantity', quantity);
            productData.append('brand', brand);
            productData.append('countInStock', stock);

            const { data } = await createProduct(productData);

            if (data.error) {
                toast.error("Product create failed. Try again.");
            } else {
                toast.success(`${data.name} is created successfully`);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error("Product creation failed. Try again.");
        }
    };

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                <AdminMenu/>
                <div className="md:w-3/4 p-3">
                    <div className="text-xl font-bold h-12 text-black">Create Product</div>   

                    {imageUrl && (
                        <div className="text-center mb-3">
                            <img 
                                src={BASE_URL ? `${BASE_URL}${imageUrl}` : imageUrl} 
                                alt="product" 
                                className="block mx-auto max-h-[200px]" 
                            />
                        </div>
                    )}    

                    <div className="mb-3">
                        <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 bg-[#101011]">
                            {image ? image.name : "Upload Image"}
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*"
                                onChange={uploadFileHandler} 
                                className="hidden" 
                            />
                        </label>
                    </div> 

                    <div className="p-3 bg-[#101011] rounded-lg border border-[#222]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="text-white block mb-2">Name</label>
                                <input 
                                    type="text"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="text-white block mb-2">Price</label>
                                <input 
                                    type="number"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)} 
                                />
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="text-white block mb-2">Quantity</label>
                                <input 
                                    type="number"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)} 
                                />
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="text-white block mb-2">Brand</label>
                                <input 
                                    type="text"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <label className="text-white block mb-2">Description</label>
                            <textarea
                                rows="4"
                                className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>

                        {/* Stock & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="text-white block mb-2">Count In Stock</label>
                                <input 
                                    type="number"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)} 
                                />
                            </div>

                            <div>
                                <label className="text-white block mb-2">Category</label>
                                <select
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Choose Category</option>
                                    {categories?.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="py-4 px-10 mt-8 rounded-lg text-lg font-bold bg-pink-600 text-white cursor-pointer hover:bg-pink-700 transition"
                        >
                            Submit Product
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProductList