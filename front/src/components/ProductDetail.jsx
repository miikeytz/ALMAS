import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { graphqlRequest } from '../graphql/client'
import Skeleton from './Skeleton'

const QUERY_PRODUCT = `
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      nombre
      descripcion
      precio
      imagenUrl
      stock
      variantes {
        id
        tipo
        valor
      }
    }
  }
`

function ProductDetail() {
  const productId = useAppStore((s) => s.selectedProductId)
  const goToCart = useAppStore((s) => s.goToCart)
  const addToCart = useAppStore((s) => s.addToCart)

  const [loading, setLoading] = useState(true)
  const [producto, setProducto] = useState(null)

  useEffect(() => {
    setLoading(true)
    graphqlRequest(QUERY_PRODUCT, { id: productId })
      .then((data) => setProducto(data.product))
      .catch((err) => console.error('Error cargando producto:', err))
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) return <Skeleton height="200px" />
  if (!producto) return <p>Producto no encontrado</p>

  return (
    <div
      style={{
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 380px) 1fr',
        gap: '2.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <img
        src={producto.imagenUrl}
        alt={producto.nombre}
        style={{
          width: '100%',
          borderRadius: '16px',
          objectFit: 'cover',
          border: '1px solid rgba(253,240,220,0.15)',
        }}
      />

      <div>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            color: 'var(--color-text)',
          }}
        >
          {producto.nombre}
        </h1>
        <p
          style={{
            margin: '0.75rem 0',
            fontSize: '1.3rem',
            fontWeight: 600,
            color: 'var(--color-gold)',
          }}
        >
          ${producto.precio}
        </p>
        <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
          {producto.descripcion}
        </p>

        {producto.variantes.length > 0 && (
          <div style={{ margin: '1.25rem 0' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Variantes:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {producto.variantes.map((v) => (
                <span
                  key={v.id}
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(253,240,220,0.3)',
                    fontSize: '0.85rem',
                  }}
                >
                  {v.tipo}: {v.valor}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() =>
              addToCart({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
              })
            }
            style={{
              border: 'none',
              background: 'var(--color-gold)',
              color: 'var(--color-bg)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.7rem 1.4rem',
              borderRadius: '999px',
            }}
          >
            Agregar al carrito
          </button>
          <button
            onClick={() => goToCart()}
            style={{
              border: '1.5px solid var(--color-gold)',
              background: 'none',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              padding: '0.7rem 1.4rem',
              borderRadius: '999px',
            }}
          >
            Ver el carrito
          </button>
        </div>
      </div>
    </div>
  )
}
export default ProductDetail