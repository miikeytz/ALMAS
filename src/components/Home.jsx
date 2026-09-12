import Sidebar from './layout/Sidebar'
import Hero from './layout/Hero'
import Footer from './layout/Footer'
import { useSearch } from '../context/SearchContext'

function Home() {
  const { query } = useSearch()
  const categorias = [
    { id: 1, nombre: 'Anillos' },
    { id: 2, nombre: 'Collares' },
    { id: 3, nombre: 'Aretes' },
  ]

   const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <Hero />
      <div style={{ display: 'flex' }}>
        <Sidebar categorias={categoriasFiltradas} />
        <main style={{ flex: 1, padding: '1rem' }}>
          <p>Productos destacados aquí...</p>
        </main>
      </div>
      <Footer />
    </div>
  )
}
export default Home