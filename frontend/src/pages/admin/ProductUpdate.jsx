import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify';
import AdminMenu from "./AdminMenu";
import { 
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useGetProductByIdQuery,
    useDeleteProductMutation,
} from "../../redux/api/productApiSlice"
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { BASE_URL } from "../../redux/features/constants";

const ProductUpdate = () => {
    const params = useParams()
    const { data: productData } = useGetProductByIdQuery(params.id, {
        skip: !params.id || params.id === "undefined",
    })

    const [image, setImage] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [brand, setBrand] = useState("")
    const [stock, setStock] = useState("")
    const [quantity, setQuantity] = useState("")

    const navigate = useNavigate()

    const { data: categories } = useFetchCategoriesQuery()
    const [uploadProductImage] = useUploadProductImageMutation()
    const [updateProduct] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()

    useEffect(() => {
        if (productData && productData._id) {
            setName(productData.name || "")
            setDescription(productData.description || "")
            setPrice(productData.price || "")
            setCategory(productData.category?._id || productData.category || "")
            setBrand(productData.brand || "")
            setStock(productData.countInStock ?? productData.stock ?? "")
            setQuantity(productData.quantity || "")
            setImage(productData.image || "")
            setImageUrl(productData.image || "")
        }
    }, [productData])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        if (!file) return;

        const formData = new FormData()
        formData.append("image", file)
        
        try {
            const res = await uploadProductImage(formData).unwrap()
            toast.success(res.message || "Image uploaded successfully")
            setImage(res.image)
            setImageUrl(res.image)
        } catch (error) {
            toast.error(error?.data?.message || error.error || "Image upload failed")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("image", image)
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("quantity", quantity)
            formData.append("brand", brand)
            formData.append("countInStock", stock)

            const res = await updateProduct({ productId: params.id, formData }).unwrap()
            
            toast.success("Product successfully updated")
            navigate("/admin/allproducts")
        } catch (error) {
            console.error("Update error details:", error)
            const errorMessage = error?.data?.message || error?.error || error?.message || "Product update failed. Try again."
            toast.error(errorMessage)
        }
    }

    const handleDelete = async () => {
        try {
            let answer = window.confirm("Are you sure you want to delete this product?")
            if (!answer) return;

            const { data } = await deleteProduct(params.id).unwrap()
            toast.success(`${data?.name || "Product"} is deleted`)
            navigate("/admin/allproducts")
        } catch (error) {
            console.error(error)
            toast.error("Delete failed. Try again.")
        }
    }

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="text-xl font-bold h-12 text-white">Update Product</div>  

                    {imageUrl && (
                        <div className="text-center mb-3">
                            <img 
                                src={
                                    imageUrl?.startsWith('http') 
                                        ? imageUrl 
                                        : `${BASE_URL}/${imageUrl?.replace(/^\/+/, '')}`
                                } 
                                alt="product" 
                                className="block mx-auto max-h-[200px]" 
                            />
                        </div>
                    )}    

                    <div className="mb-3">
                        <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 bg-[#101011]">
                            {image ? "Change Image" : "Upload Image"}
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={uploadFileHandler} 
                                className="hidden" 
                            />
                        </label>
                    </div> 

                    <div className="p-3 bg-[#101011] rounded-lg border border-[#222]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-white block mb-2">Name</label>
                                <input 
                                    type="text"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>

                            <div>
                                <label className="text-white block mb-2">Price</label>
                                <input 
                                    type="number"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)} 
                                />
                            </div>

                            <div>
                                <label className="text-white block mb-2">Quantity</label>
                                <input 
                                    type="number"
                                    className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)} 
                                />
                            </div>

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

                        <div className="mt-6">
                            <label className="text-white block mb-2">Description</label>
                            <textarea
                                rows="4"
                                className="p-4 w-full border border-gray-700 rounded-lg bg-[#0b0b0c] text-white focus:outline-none focus:border-pink-600"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>

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
                                    value={category}
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

                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmit}
                                className="py-4 px-10 mt-8 rounded-lg text-lg font-bold bg-pink-600 text-white cursor-pointer hover:bg-pink-700 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleDelete}
                                className="py-4 px-10 mt-8 rounded-lg text-lg font-bold bg-red-600 text-white cursor-pointer hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate