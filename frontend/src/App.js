import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', age: '', gender: '' });
  const [loading, setLoading] = useState(true);

  // Načítanie zoznamu používateľov
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('ERROR - Čítanie zoznamu používateľov:', err);
    } finally {
      setLoading(false);
    }
  };

  // Vyhľadávanie používateľov
  const searchUsers = async (query) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/users/search?query=${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error('ERROR - Vyhľadávanie používateľov:', err);
    }
  };

  // Odstránenie používateľa
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('ERROR - Odstránenie použivateľa:', err);
    }
  };

  // Spustenie editácie, nastaví terajšie údaje daného uživateľa 
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ name: user.name, age: user.age, gender: user.gender });
  };

  // Zmeny vo formulári
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Uložiť zmeny - PUT request
  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/users/${id}`, editedUser);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error('ERROR - Ukladanie zmien použivateľa:', err);
    }
  };

  // Zrušenie editácie
  const handleEditCancel = () => {
    setEditingUserId(null);
  };

  // Pri prvom rendrovaní komponentu
  useEffect(() => {
    fetchUsers();
  }, []);

  // Aktualizuje sa stav input poľa pre vyhľadávaciu funkciu s aktuálnym dotazom
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  return (
    <div className="container mt-5">
      <h1>Users</h1>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Meno</th>
              <th>Vek</th>
              <th>Pohlavie</th>
              <th>Akcie</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="number"
                      name="age"
                      value={editedUser.age}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.age
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      name="gender"
                      value={editedUser.gender}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.gender
                  )}
                </td>
                <td>
                  {editingUserId === user.id ? (
                    <>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleEditSave(user.id)}
                      >
                        Save
                      </button>
                      <button className="btn btn-secondary" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
