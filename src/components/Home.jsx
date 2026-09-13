// src/components/Home.jsx
import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { graphqlRequest } from '../graphql/client'
import { useSearch } from '../context/SearchContext'

const QUERY_PRODUCTS = `query { products { id nombre precio imagenUrl } }`

function Home() {
  const [productos, setProductos] = useState([])
  const { query } = useSearch()

  useEffect(() => {
    graphqlRequest(QUERY_PRODUCTS).then((data) => setProductos(data.products))
  }, [])

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Destacados</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        {productosFiltrados.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  )
}
export default Home