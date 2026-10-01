
import { useAppStore } from '../../store/useAppStore'

function Sidebar({ categorias }) {
  const goToCategory = useAppStore((s) => s.goToCategory)
  const goHome = useAppStore((s) => s.goHome)
  const selectedCategoryId = useAppStore((s) => s.selectedCategoryId)

  return (
    <aside
      style={{
        width: '110px',
        padding: '1.5rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      <button
        onClick={goHome}
        style={{
          border: '1.5px solid var(--color-gold)',
          background: 'none',
          color: 'var(--color-gold)',
          cursor: 'pointer',
          fontSize: '0.75rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '999px',
        }}
      >
        Inicio
      </button>

      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => goToCategory(cat.id)}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            padding: 0,
          }}
        >
          <img
            src={cat.imagenUrl || `https://placehold.co/80x80/c9a24b/8f1268?text=${cat.nombre[0]}`}
            alt={cat.nombre}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: selectedCategoryId === cat.id
                ? '2.5px solid var(--color-gold)'
                : '2px solid rgba(253,240,220,0.4)',
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text)' }}>{cat.nombre}</span>
        </button>
      ))}
    </aside>
  )
}

export default Sidebar