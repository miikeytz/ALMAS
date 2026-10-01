import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { graphqlRequest } from '../graphql/client'
import Skeleton from './Skeleton'
import ProductCard from './ProductCard'

const QUERY_PRODUCTS = `
  query GetProducts($categoriaId: Int) {
    products(categoriaId: $categoriaId) {
      id
      nombre
      precio
      imagenUrl
    }
  }
`

function CategoryDetail() {
  const categoryId = useAppStore((s) => s.selectedCategoryId)
  const goHome = useAppStore((s) => s.goHome)

  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    graphqlRequest(QUERY_PRODUCTS, { categoriaId: categoryId })
      .then((data) => setProductos(data.products))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)' }}>Categoría</h2>

      {error && <p style={{ color: '#e05252' }}>{error}</p>}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          <Skeleton height="220px" />
          <Skeleton height="220px" />
          <Skeleton height="220px" />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          {productos.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  )
}
export default CategoryDetail