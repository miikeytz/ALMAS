
import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { useSearch } from './context/SearchContext'
import { graphqlRequest } from './graphql/client'
import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import Hero from './components/layout/Hero'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import CategoryDetail from './components/CategoryDetail'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

const QUERY_CATEGORIAS = `query { categorias { id nombre imagenUrl } }`

function App() {
  const screen = useAppStore((s) => s.screen)
  const [categorias, setCategorias] = useState([])
  const { query } = useSearch()

  useEffect(() => {
    graphqlRequest(QUERY_CATEGORIAS)
      .then((data) => setCategorias(data.categorias))
      .catch((err) => console.error(err))
  }, [])

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <TopBar />
      {screen === 'home' && <Hero />}
      <div style={{ display: 'flex' }}>
        <Sidebar categorias={categoriasFiltradas} />
        <main style={{ flex: 1, minHeight: '80vh' }}>
          {screen === 'home' && <Home />}
          {screen === 'category' && <CategoryDetail />}
          {screen === 'product' && <ProductDetail />}
          {screen === 'cart' && <Cart />}
          {screen === 'checkout' && <Checkout />}
        </main>
      </div>
      <Footer />
    </>
  )
}
export default App