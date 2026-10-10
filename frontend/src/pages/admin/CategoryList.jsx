import { useState } from "react";
import { toast } from 'react-toastify';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Create Category Handler
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Category name is required');
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Creating category failed, try again.');
    }
  };

  // Update Category Handler
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error('Category name is required');
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated.`);
        setSelectedCategory(null);
        setUpdatingName('');
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Updating category failed, try again.');
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Deleting category failed, try again.');
    }
  };

  return (
    <div className="ml-[15rem] flex flex-col md:flex-row bg-white text-black min-h-screen p-4">
      <AdminMenu/>
      <div className="md:w-3/4 p-3">
        <div className="h-12 text-xl font-semibold text-grey-800">Manage Categories</div>
        
        <CategoryForm 
          value={name} 
          setValue={setName} 
          handleSubmit={handleCreateCategory} 
        /> 
        
        <br />
        <hr className="border-gray-300" />

        <div className="flex flex-wrap mt-4">
          {categories?.map((category) => (
            <div key={category._id}>
              <button 
                className="bg-transparent border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm 
            value={updatingName} 
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory} 
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal> 
      </div>
    </div>
  );
};

export default CategoryList;