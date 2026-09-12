import { useAppStore } from '../store/useAppStore'

function Cart() {
  const carrito = useAppStore((s) => s.cart)
  const goToCheckout = useAppStore((s) => s.goToCheckout)

  return (
    <div>
      <h1>ALMĀS</h1>
      <div>
        {carrito.map((item, i) => (
          <div key={i}>
            <p>{item.nombre}</p>
          </div>
        ))}
        <button onClick={() => goToCheckout()}>Ir a pagar</button>
      </div>
    </div>
  )
}
export default Cart
