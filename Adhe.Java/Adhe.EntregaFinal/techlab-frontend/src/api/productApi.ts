import axios from './axios';

export interface Product {
  id: number | string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: { id?: number | string; nombre?: string } | string;
  stock?: number;
  imagenUrl?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get('/api/productos');
  const data = res.data;

  // Normalizar varias formas de respuesta posibles del backend
  if (Array.isArray(data)) return data as Product[];
  if (data?.content && Array.isArray(data.content)) return data.content as Product[];
  if (data?.data && Array.isArray(data.data)) return data.data as Product[];

  // Si no es un array, devolver array vacío y advertir en consola para debugging
  // eslint-disable-next-line no-console
  console.warn('getProducts: unexpected response shape, expected array but got', data);
  return [];
};

export const updateProduct = async (id: number | string, payload: Partial<Product>): Promise<Product | null> => {
  try {
    const res = await axios.put(`/api/productos/${id}`, payload);
    return res.data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('updateProduct error', err);
    return null;
  }
};

export default { getProducts, updateProduct };
