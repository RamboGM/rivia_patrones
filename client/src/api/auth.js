export const getCurrentUser = async () => {
  const resp = await fetch('/api/current_user', {
    credentials: 'include',
  });
  if (resp.status === 401) return null;
  if (!resp.ok) throw new Error('No se pudo cargar el usuario actual');
  return resp.json();
};

export const logout = async () => {
  const resp = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cerrar sesión');
  return resp.json();
};
