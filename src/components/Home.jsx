import Sidebar from './layout/Sidebar'
import Hero from './layout/Hero'
import Footer from './layout/Footer'

function Home() {
  const categorias = [
    { id: 1, nombre: 'Anillos' },
    { id: 2, nombre: 'Collares' },
    { id: 3, nombre: 'Aretes' },
  ]

  return (
    <div>
      <Hero />
      <div style={{ display: 'flex' }}>
        <Sidebar categorias={categorias} />
        <main style={{ flex: 1, padding: '1rem' }}>
          <p>Productos destacados aquí...</p>
        </main>
      </div>
      <Footer />
    </div>
  )
}
export default Home