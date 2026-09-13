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
        backgroundColor: 'var(--color-purple)',
        borderBottom: '2px solid var(--color-gold)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <h1
        style={{
          margin: 0,
          cursor: 'pointer',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          letterSpacing: '1px',
          color: '#fff',
        }}
        onClick={goHome}
      >
        ALMĀS
      </h1>

      <input
        type="text"
        placeholder="Buscar joyas..."

        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: '0 1 320px',
          padding: '0.5rem 1.2rem',
          borderRadius: '999px',
          border: '1px solid rgba(253,240,220,0.3)',
          backgroundColor: 'rgba(253,240,220,0.08)',
          color: '#fff'
        }}
      />

      <button
        onClick={goToCart}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          border: '1.5px solid var(--color-gold)',
          background: 'none',
          color: 'var(--color-gold)',
          cursor: 'pointer',
          padding: '0.5rem 0.5rem',
          borderRadius: '999px',
          fontSize: '1.3rem',
        }}
      >
        🛒 {cartCount > 0 && `(${cartCount})`}
      </button>
    </header>
  )
}

export default TopBar