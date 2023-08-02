import React, { useState } from 'react';

const DataTable = () => {
  // Replace this with actual data for the table
  const [tableData, setTableData] = useState([
    { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
    // Add more data as needed
  ]);

  // State to store the current user being edited
  const [editUser, setEditUser] = useState(null);

  // State to store the updated user data in the form
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEdit = (userId) => {
    const userToEdit = tableData.find((user) => user.id === userId);
    setEditUser(userToEdit);
    setFormData({ name: userToEdit.name, age: userToEdit.age.toString(), email: userToEdit.email });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editUser) return;

    // Find the index of the user being edited
    const editIndex = tableData.findIndex((user) => user.id === editUser.id);
    if (editIndex === -1) return;

    // Create a copy of the tableData array
    const updatedTableData = [...tableData];

    // Update the user data with the new formData
    updatedTableData[editIndex] = {
      ...editUser,
      name: formData.name,
      age: parseInt(formData.age),
      email: formData.email,
    };

    setTableData(updatedTableData);
    setEditUser(null);
    setFormData({ name: '', age: '', email: '' });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">User Data Table</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Age</th>
            <th className="text-left">Email</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((user) => (
            <tr key={user.id}>
              <td>{editUser?.id === user.id ? <input type="text" name="name" value={formData.name} onChange={handleChange} /> : user.name}</td>
              <td>{editUser?.id === user.id ? <input type="text" name="age" value={formData.age} onChange={handleChange} /> : user.age}</td>
              <td>{editUser?.id === user.id ? <input type="text" name="email" value={formData.email} onChange={handleChange} /> : user.email}</td>
              <td>
                {editUser?.id === user.id ? (
                  <div className="flex">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleUpdate}>
                      Save
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setEditUser(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleEdit(user.id)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;