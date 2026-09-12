import { useAppStore } from '../../store/useAppStore'

function Sidebar({ categorias }) {
  const goToCategory = useAppStore((s) => s.goToCategory)

  return (
    <aside
      style={{
        width: '200px',
        padding: '1rem',
        color: 'var(--color-text)',
      }}
    >
      <h3>Categorías</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categorias.map((cat) => (
          <li key={cat.id} style={{ marginBottom: '0.5rem' }}>
            <button onClick={() => goToCategory(cat.id)}>{cat.nombre}</button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar