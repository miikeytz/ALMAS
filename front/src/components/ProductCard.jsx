import { useAppStore } from '../store/useAppStore'

function ProductCard({ producto }) {
  const goToProduct = useAppStore((s) => s.goToProduct)

  return (
    <div
      onClick={() => goToProduct(producto.id)}
      style={{
        cursor: 'pointer',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'rgba(143,18,104,0.3)',
        border: '1px solid rgba(143,18,104,0.6)',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <img
        src={producto.imagenUrl}
        alt={producto.nombre}
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
      />
      <div style={{ padding: '0.8rem' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{producto.nombre}</p>
        <p style={{ margin: '0.3rem 0 0', color: 'var(--color-gold)' }}>${producto.precio}</p>
      </div>
    </div>
  )
}
export default ProductCard