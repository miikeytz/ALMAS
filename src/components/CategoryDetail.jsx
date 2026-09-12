import { useAppStore } from '../store/useAppStore'

function CategoryDetail() {
  const categoryId = useAppStore((s) => s.selectedCategoryId)
  const goToProduct = useAppStore((s) => s.goToProduct)
  const goHome = useAppStore((s) => s.goHome)

  return (
    <div>
      <button onClick={goHome}>← Volver</button>
      <h2>Categoría {categoryId}</h2>
      <button onClick={() => goToProduct(101)}>Ver producto ejemplo</button>
    </div>
  )
}
export default CategoryDetail
