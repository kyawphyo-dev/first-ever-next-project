const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  TAGS: "/tags",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CATEGORIES: "/categories",
  QUESTIONS: "/questions",
  QUESTIONS_DETAILS: (id: string) => `/questions/${id}`,
};

export default ROUTES;
