import { fetchHandler } from "./fetchHaldler";
const API_URL = "http://localhost:3000/api";
export const api = {
  // User API
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

    // Get user by email
    // api.users.getByEmail("john@example.com")
    getByEmail: (email: string) =>
      fetchHandler(API_URL + "/users/email/", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    // Get user by provider account ID
    // api.users.getByProvider("123456")
    getByProvider: (providerAccountId: string) =>
      fetchHandler(API_URL + "/users/provider/", {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),

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

  auth: {
    // SignInWithOAuth
    SignInWithOAuth: ({
      provider,
      providerAccountId,
      user,
    }: {
      provider: string;
      providerAccountId: string;
      user: {
        name: string;
        username: string;
        email: string;
        image?: string;
        password?: string;
      };
    }) => {
      return fetchHandler(API_URL + "/auth/signin_with_oauth", {
        method: "POST",
        body: JSON.stringify({ provider, providerAccountId, user }),
      });
    },
  },
};
