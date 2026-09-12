// src/components/ProductDetail.jsx
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
    <div>
      <h1>{producto.nombre}</h1>
      <img src={producto.imagenUrl} alt={producto.nombre} width={200} />
      <p>{producto.descripcion}</p>
      <p>${producto.precio}</p>

      {producto.variantes.length > 0 && (
        <div>
          <p>Variantes:</p>
          {producto.variantes.map((v) => (
            <span key={v.id} style={{ marginRight: '0.5rem' }}>
              {v.tipo}: {v.valor}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() =>
          addToCart({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
          })
        }
      >
        Agregar al carrito
      </button>
      <button onClick={() => goToCart()}>Ver el carrito</button>
    </div>
  )
}
export default ProductDetail