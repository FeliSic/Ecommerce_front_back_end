export function fetchAPI(endpoint: string, requiresAuth: boolean = true): Promise<any> {
  const headers: HeadersInit = {};
  
  if (requiresAuth) {
    const token = localStorage.getItem('apiToken');
    if (!token) {
      return Promise.reject(new Error('API token is missing'));
    }
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(endpoint, {
    headers,
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    });
}

// User Fetchings -----------------------------------------------------------------------------------------------------------------------------------------------------------

export function sendAuthEmail(email: string): Promise<{ success: boolean; error?: string }> {
  return fetch('/api/auth/auth', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return { success: data.success, ...data }; // Asegúrate de que el backend devuelva un objeto con success
      } else {
        return { success: false, error: data.error};
      }
    });
}


export function getToken(email: string, code: string): Promise<{ success: boolean; token?: string; error?: string }> {
  return fetch('/api/auth/token/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('apiToken', data.token);
        return { success: true, token: data.token };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    });
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------

// Products Fetchings -----------------------------------------------------------------------------------------------------------------------------------------------------------

 const searchProducts = (query: string): Promise<any> => {
  return fetch(`/api/search/search/search?query=${encodeURIComponent(query)}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    });
};