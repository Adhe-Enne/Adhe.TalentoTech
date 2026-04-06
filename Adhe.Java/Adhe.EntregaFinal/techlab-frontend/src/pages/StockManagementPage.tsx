import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../app/store';
import { useAppDispatch } from '../hooks/useAuth';
import { fetchProducts, updateProduct } from '../features/products/productSlice';

const StockManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.products);
  const [edits, setEdits] = useState<Record<string, number | undefined>>({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // initialize edits map when items change
    const map: Record<string, number> = {};
    items?.forEach((p) => {
      map[String(p.id)] = p.stock ?? 0;
    });
    setEdits(map);
  }, [items]);

  const handleChange = (id: string, value: string) => {
    const num = Number(value);
    setEdits((e) => ({ ...e, [id]: Number.isNaN(num) ? 0 : num }));
  };

  const handleSave = async (id: string) => {
    const stock = edits[id];
    if (stock === undefined) return;
    await dispatch(updateProduct({ id, changes: { stock } }));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Stock</h2>
      <div style={{ marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Producto</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Precio</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Stock</th>
              <th style={{ textAlign: 'left', padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 8 }}>{p.nombre}</td>
                <td style={{ padding: 8 }}>${p.precio?.toFixed?.(2) ?? p.precio}</td>
                <td style={{ padding: 8 }}>
                  <input
                    type="number"
                    value={edits[String(p.id)] ?? 0}
                    onChange={(e) => handleChange(String(p.id), e.target.value)}
                    style={{ width: 100 }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => handleSave(String(p.id))}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: '#0ea5a4',
                      color: '#fff',
                      border: 'none',
                    }}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagementPage;
