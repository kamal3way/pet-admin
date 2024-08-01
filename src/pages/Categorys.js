import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Categorys() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          'https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_services?find=&skip=&limit=1000&sort=&select=&deep=&getTotalCount=false',
          { headers: getAuthHeaders() }
        );
        console.log('API Response:', response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setServices(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      }
    };

    fetchServices();

    const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    setCategories(savedCategories);
  }, []);

  const getAuthHeaders = () => {
    const token1 = localStorage.getItem("token1");
    const accessToken = localStorage.getItem("accessToken");

    return {
      "x-am-authorization": token1,
      "x-am-user-authorization": accessToken,
    };
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleNewSubCategoryChange = (event) => {
    setNewSubCategory(event.target.value);
  };

  const handleAddSubCategory = () => {
    if (newSubCategory && !subCategories.includes(newSubCategory)) {
      setSubCategories([...subCategories, newSubCategory]);
      setNewSubCategory('');
    }
  };

  const handleRemoveSubCategory = (subCategory) => {
    setSubCategories(subCategories.filter(item => item !== subCategory));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      serviceCategory: selectedService,
      categoryName,
      subCategoryName: subCategories
    };

    try {
      const response = await axios.post(
        'https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/pet_market_filters/save-single-or-multiple',
        data,
        { headers: getAuthHeaders() }
      );
      console.log('API Response:', response.data);

      const updatedCategories = editingCategoryIndex !== null
        ? categories.map((cat, index) =>
            index === editingCategoryIndex ? { ...cat, categoryName, subCategories } : cat
          )
        : [...categories, { serviceCategory: selectedService, categoryName, subCategoryName: subCategories }];

      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));

      setCategoryName('');
      setSubCategories([]);
      setSelectedService('');
      setEditingCategoryIndex(null);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const handleEditCategory = (index) => {
    setEditingCategoryIndex(index);
    setCategoryName(categories[index].categoryName);
    setSubCategories(categories[index].subCategoryName);
    setSelectedService(categories[index].serviceCategory);
  };

  const handleDeleteCategory = async (index) => {
    const categoryId = categories[index]._id;
    if (!categoryId) {
      console.error('Category ID is missing for deletion');
      return;
    }
  
    try {
      await axios.delete(
        `https://pets.dev.savaapi.com/api/schema/dev1/mongodb/pets/service_categories/${categoryId}`,
        { headers: getAuthHeaders() }
      );
  
      // Remove the deleted category from local state and localStorage
      const updatedCategories = categories.filter((_, i) => i !== index);
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Category</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="service" className="form-label">Select Service:</label>
          <select
            id="service"
            className="form-select"
            value={selectedService}
            onChange={handleServiceChange}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">Category Name:</label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={categoryName}
            onChange={handleCategoryNameChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newSubCategory" className="form-label">Subcategory:</label>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={newSubCategory}
              onChange={handleNewSubCategoryChange}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddSubCategory}
            >
              Add Subcategory
            </button>
          </div>
          <ul className="list-group mb-3">
            {subCategories.map((subCategory, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {subCategory}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveSubCategory(subCategory)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="btn btn-success">
          {editingCategoryIndex !== null ? 'Update' : 'Submit'}
        </button>
      </form>

      <h3 className="mt-4">Categories</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Service</th>
            <th>Category Name</th>
            <th>Subcategories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td>{category.serviceCategory}</td>
              <td>{category.categoryName}</td>
              <td>{category.subCategoryName.join(', ')}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditCategory(index)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteCategory(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categorys;
