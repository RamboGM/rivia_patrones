const headers = {
  'Content-Type': 'application/json',
};

export const getPatrones = async () => {
  const resp = await fetch('/api/patrones', { credentials: 'include' });
  if (resp.status === 401) throw new Error('No autenticado');
  if (!resp.ok) throw new Error('No se pudieron cargar los patrones');
  return resp.json();
};

export const getPatron = async (id) => {
  const resp = await fetch(`/api/patrones/${id}`, { credentials: 'include' });
  if (resp.status === 401) throw new Error('No autenticado');
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error('No se pudo cargar el patrón');
  return resp.json();
};

export const createPatron = async (payload) => {
  const resp = await fetch('/api/patrones', {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(payload),
  });
  if (resp.status === 403) {
    const data = await resp.json();
    throw new Error(data?.message || 'Límite alcanzado');
  }
  if (!resp.ok) throw new Error('No se pudo crear el patrón');
  return resp.json();
};

export const updatePatron = async (id, payload) => {
  const resp = await fetch(`/api/patrones/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers,
    body: JSON.stringify(payload),
  });
  if (resp.status === 403) {
    const data = await resp.json();
    throw new Error(data?.message || 'Límite alcanzado');
  }
  if (!resp.ok) throw new Error('No se pudo actualizar el patrón');
  return resp.json();
};

export const deletePatron = async (id) => {
  const resp = await fetch(`/api/patrones/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo eliminar el patrón');
  return resp.json();
};

export const exportPdf = async (id) => {
  const resp = await fetch(`/api/patrones/${id}/pdf`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo exportar el PDF');
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `patron-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
