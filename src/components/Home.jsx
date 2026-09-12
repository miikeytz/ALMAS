import { useAppStore } from '../store/useAppStore'

function Home() {
  const goToCategory = useAppStore((s) => s.goToCategory)

  const categorias = [
    { id: 1, nombre: 'Anillos' },
    { id: 2, nombre: 'Collares' },
    { id: 3, nombre: 'Aretes' },
  ]

  return (
    <div>
      <h1>ALMĀS</h1>
      <div>
        {categorias.map((cat) => (
          <button key={cat.id} onClick={() => goToCategory(cat.id)}>
            {cat.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}
export default Home
