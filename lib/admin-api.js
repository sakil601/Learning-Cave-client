import { apiFetch } from "./api";

export const admin = {
  categories: (includeInactive = true) => apiFetch(`/admin/categories?includeInactive=${includeInactive}`),
  createCategory: (body) => apiFetch('/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => apiFetch(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteCategory: (id) => apiFetch(`/admin/categories/${id}`, { method: 'DELETE' }),

  products: (query = '') => apiFetch(`/admin/products${query ? `?${query}` : ''}`),
  createProduct: (body) => apiFetch('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => apiFetch(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProduct: (id) => apiFetch(`/admin/products/${id}`, { method: 'DELETE' }),

  courses: (query = '') => apiFetch(`/admin/courses${query ? `?${query}` : ''}`),
  course: (id) => apiFetch(`/admin/courses/${id}`),
  createCourse: (body) => apiFetch('/admin/courses', { method: 'POST', body: JSON.stringify(body) }),
  updateCourse: (id, body) => apiFetch(`/admin/courses/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  courseAction: (id, action) => apiFetch(`/admin/courses/${id}/${action}`, { method: 'POST' }),
  createModule: (courseId, body) => apiFetch(`/admin/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(body) }),
  updateModule: (moduleId, body) => apiFetch(`/admin/modules/${moduleId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteModule: (moduleId) => apiFetch(`/admin/modules/${moduleId}`, { method: 'DELETE' }),
  createLesson: (moduleId, body) => apiFetch(`/admin/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(body) }),
  updateLesson: (lessonId, body) => apiFetch(`/admin/lessons/${lessonId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteLesson: (lessonId) => apiFetch(`/admin/lessons/${lessonId}`, { method: 'DELETE' }),

  createQuiz: (moduleId, body) => apiFetch(`/admin/modules/${moduleId}/quiz`, { method: 'POST', body: JSON.stringify(body) }),
  moduleQuiz: (moduleId) => apiFetch(`/admin/modules/${moduleId}/quiz`),
  quiz: (quizId) => apiFetch(`/admin/quizzes/${quizId}`),
  updateQuiz: (quizId, body) => apiFetch(`/admin/quizzes/${quizId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteQuiz: (quizId) => apiFetch(`/admin/quizzes/${quizId}`, { method: 'DELETE' }),
  addQuizQuestion: (quizId, body) => apiFetch(`/admin/quizzes/${quizId}/questions`, { method: 'POST', body: JSON.stringify(body) }),
  updateQuizQuestion: (questionId, body) => apiFetch(`/admin/questions/${questionId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteQuizQuestion: (questionId) => apiFetch(`/admin/questions/${questionId}`, { method: 'DELETE' }),

  moduleResources: (moduleId) => apiFetch(`/admin/modules/${moduleId}/resources`),
  createModuleResource: (moduleId, body) => apiFetch(`/admin/modules/${moduleId}/resources`, { method: 'POST', body: JSON.stringify(body) }),
  updateModuleResource: (resourceId, body) => apiFetch(`/admin/module-resources/${resourceId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteModuleResource: (resourceId) => apiFetch(`/admin/module-resources/${resourceId}`, { method: 'DELETE' }),

  coupons: () => apiFetch('/admin/coupons'),
  createCoupon: (body) => apiFetch('/admin/coupons', { method: 'POST', body: JSON.stringify(body) }),
  updateCoupon: (id, body) => apiFetch(`/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteCoupon: (id) => apiFetch(`/admin/coupons/${id}`, { method: 'DELETE' }),

  liveCourses: (query = '') => apiFetch(`/admin/live-courses${query ? `?${query}` : ''}`),
  createLiveCourse: (body) => apiFetch('/admin/live-courses', { method: 'POST', body: JSON.stringify(body) }),
  liveCourse: (id) => apiFetch(`/admin/live-courses/${id}`),
  liveCourseByProduct: (productId) => apiFetch(`/admin/live-courses/by-product/${productId}`),
  createBatch: (liveCourseId, body) => apiFetch(`/admin/live-courses/${liveCourseId}/batches`, { method: 'POST', body: JSON.stringify(body) }),
  updateBatch: (batchId, body) => apiFetch(`/admin/batches/${batchId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  createSession: (batchId, body) => apiFetch(`/admin/batches/${batchId}/sessions`, { method: 'POST', body: JSON.stringify(body) }),
  updateSession: (sessionId, body) => apiFetch(`/admin/live-sessions/${sessionId}`, { method: 'PATCH', body: JSON.stringify(body) }),

  ebook: (productId) => apiFetch(`/admin/products/${productId}/ebook`),
  createEbook: (productId, body) => apiFetch(`/admin/products/${productId}/ebook`, { method: 'POST', body: JSON.stringify(body) }),
  updateEbook: (ebookId, body) => apiFetch(`/admin/ebooks/${ebookId}`, { method: 'PATCH', body: JSON.stringify(body) }),

  digitalProduct: (productId) => apiFetch(`/admin/products/${productId}/digital-product`),
  createDigitalProduct: (productId, body) => apiFetch(`/admin/products/${productId}/digital-product`, { method: 'POST', body: JSON.stringify(body) }),
  updateDigitalProduct: (id, body) => apiFetch(`/admin/digital-products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  bundle: (productId) => apiFetch(`/admin/products/${productId}/bundle`),
  createBundle: (productId, body) => apiFetch(`/admin/products/${productId}/bundle`, { method: 'POST', body: JSON.stringify(body) }),
  updateBundle: (bundleId, body) => apiFetch(`/admin/bundles/${bundleId}`, { method: 'PATCH', body: JSON.stringify(body) }),

  users: (query = '') => apiFetch(`/admin/users${query ? `?${query}` : ''}`),
  instructors: (query = '') => apiFetch(`/admin/instructors${query ? `?${query}` : ''}`),
  payments: (query = '') => apiFetch(`/admin/payments${query ? `?${query}` : ''}`),

  updateInstructorStatus: (id, status) =>
    apiFetch(`/admin/instructors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  verifyManualPayment: (id) => apiFetch(`/admin/payments/${id}/verify`, { method: 'PATCH' }),
  rejectManualPayment: (id) => apiFetch(`/admin/payments/${id}/reject`, { method: 'PATCH' }),

  uploadAsset: async (kind, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiFetch(`/admin/assets/${kind}`, { method: 'POST', body: form });
  },
};
