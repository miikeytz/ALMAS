// src/components/layout/TopBar.jsx
import { useAppStore } from '../../store/useAppStore'
import { useSearch } from '../../context/SearchContext'

function TopBar() {
  const goHome = useAppStore((s) => s.goHome)
  const goToCart = useAppStore((s) => s.goToCart)
  const cartCount = useAppStore((s) => s.cart.length)
  const { query, setQuery } = useSearch()

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <h1
        style={{ margin: 0, cursor: 'pointer', fontFamily: 'var(--font-heading)' }}
        onClick={goHome}
      >
        ALMĀS
      </h1>

      <input
        type="text"
        placeholder="Buscar joyas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={goToCart} style={{ position: 'relative' }}>
        🛒 Carrito {cartCount > 0 && `(${cartCount})`}
      </button>
    </header>
  )
}

export default TopBar