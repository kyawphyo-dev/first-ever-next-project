import { fetchHandler } from "./fetchHaldler";
const API_URL = "http://localhost:3000/api";
export const api = {
  users: {
    // Get all users
    // api.users.getAll()
    getAll: () => fetchHandler(API_URL + "/users"),

    // Create a new user
    // api.users.create({ name: "John Doe", email: "john@example.com", password: "123456" })
    create: (data: { name: string; email: string; password: string }) =>
      fetchHandler(API_URL + "/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    // Get user by ID
    // api.users.getById("123")
    getById: (id: string) => fetchHandler(API_URL + "/users/" + id),

    // Update user by ID
    // api.users.update("123", { name: "Jane Doe", email: "jane@example.com" })
    update: (
      id: string,
      data: { name?: string; email?: string; password?: string },
    ) => {
      fetchHandler(API_URL + "/users/" + id, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    // Delete user by ID
    // api.users.delete("123")
    delete: (id: string) =>
      fetchHandler(API_URL + "/users/" + id, {
        method: "DELETE",
      }),
  },
};
