// src/components/CategoryDetail.jsx
import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import Skeleton from './Skeleton'

function CategoryDetail() {
  const categoryId = useAppStore((s) => s.selectedCategoryId)
  const goToProduct = useAppStore((s) => s.goToProduct)
  const goHome = useAppStore((s) => s.goHome)

  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState([])

  useEffect(() => {
    setLoading(true)
    // Simulación de fetch — luego esto será una query GraphQL real
    const timer = setTimeout(() => {
      setProductos([
        { id: 101, nombre: 'Anillo de Oro' },
        { id: 102, nombre: 'Anillo de Plata' },
      ])
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [categoryId]) // se re-ejecuta si cambias de categoría

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
            <p>{p.nombre}</p>
            <button onClick={() => goToProduct(p.id)}>Ver producto</button>
          </div>
        ))
      )}
    </div>
  )
}
export default CategoryDetail