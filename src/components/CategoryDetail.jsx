// src/components/CategoryDetail.jsx
import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { graphqlRequest } from '../graphql/client'
import Skeleton from './Skeleton'

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
  const goToProduct = useAppStore((s) => s.goToProduct)
  const goHome = useAppStore((s) => s.goHome)

  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([])

  useEffect(() => {
    setLoading(true)
    graphqlRequest(QUERY_PRODUCTS, { categoriaId: categoryId })
      .then((data) => setProductos(data.products))
      .catch((err) => console.error('Error cargando productos:', err))
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <div>
      <button onClick={goHome}>← Volver</button>
      <h2>Categoría {categoryId}</h2>

      {loading ? (
        <>
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </>
      ) : (
        productos.map((p) => (
          <div key={p.id}>
            <img src={p.imagenUrl} alt={p.nombre} width={80} />
            <p>{p.nombre} — ${p.precio}</p>
            <button onClick={() => goToProduct(p.id)}>Ver producto</button>
          </div>
        ))
      )}
    </div>
  )
}
export default CategoryDetail