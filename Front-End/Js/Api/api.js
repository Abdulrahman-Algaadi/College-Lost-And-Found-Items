
const API_BASE_URL = "http://localhost:5152/api";

// Generic request
async function request(url, method = "GET", data) {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (data) options.body = JSON.stringify(data);

    const res = await fetch(`${API_BASE_URL}${url}`, options);
    if (!res.ok) throw new Error(`API request failed: ${res.statusText}`);
    return res.json();
}

// Admin API
const AdminAPI = {
    login: (username, password) =>
        request("/Admins/Login", "POST", { UserName: username, Password: password }),
};

// Items API
const ItemsAPI = {
    getAll: () => request("/items/GetAllItems"),
    getById: (id) => request(`/items/GetItemByID/${id}`),
    create: (item) => request("/items/CreateNewItem", "POST", item),
    update: (id, item) => request(`/items/UpdateItemByID/${id}`, "PUT", item),
    delete: (id) => request(`/items/DeleteItemByID/${id}`, "DELETE"),
};