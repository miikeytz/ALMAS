import { useAppStore } from '../store/useAppStore'

function Cart() {
  const carrito = useAppStore((s) => s.cart)
  const goToCheckout = useAppStore((s) => s.goToCheckout)

  const total = carrito.reduce((sum, item) => sum + item.precio * (item.cantidad || 1), 0)

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}
      >
        ALMĀS
      </h1>

      {carrito.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(253,240,220,0.7)' }}>
          Tu carrito está vacío.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {carrito.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(253,240,220,0.15)',
                backgroundColor: 'rgba(253,240,220,0.06)',
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{item.nombre}</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'rgba(253,240,220,0.7)' }}>
                  Cantidad: {item.cantidad || 1}
                </p>
              </div>
              <p style={{ margin: 0, color: 'var(--color-gold)', fontWeight: 600 }}>
                ${item.precio * (item.cantidad || 1)}
              </p>
            </div>
          ))}
        </div>
      )}

      {carrito.length > 0 && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 0.25rem',
              marginBottom: '1.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            <span>Total</span>
            <span style={{ color: 'var(--color-gold)' }}>${total}</span>
          </div>

          <button
            onClick={() => goToCheckout()}
            style={{
              border: 'none',
              background: 'var(--color-gold)',
              color: 'var(--color-bg)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.7rem 1.4rem',
              borderRadius: '999px',
              width: '100%',
            }}
          >
            Ir a pagar
          </button>
        </>
      )}
    </div>
  )
}
export default Cart