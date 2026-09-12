import { useAppStore } from '../store/useAppStore'

function ProductDetail() {
  const productId = useAppStore((s) => s.selectedProductId)
  const goToCart = useAppStore((s) => s.goToCart)
  const addToCart = useAppStore((s) => s.addToCart)

  return (
    <div>
      <h1>ALMĀS</h1>
      <p>Producto: {productId}</p>
      <div>
        <button onClick={() => addToCart({ id: productId, nombre: `Producto ${productId}` })}>
          Agregar al carrito
        </button>
        <button onClick={() => goToCart()}>Ver el carrito</button>
      </div>
    </div>
  )
}
export default ProductDetail
