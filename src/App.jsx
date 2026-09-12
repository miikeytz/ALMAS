import { useAppStore } from './store/useAppStore'
import TopBar from './components/layout/TopBar'
import Home from './components/Home'
import CategoryDetail from './components/CategoryDetail'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

function App() {
  const screen = useAppStore((s) => s.screen)

  return (
    <>
      <TopBar />
      {screen === 'home' && <Home />}
      {screen === 'category' && <CategoryDetail />}
      {screen === 'product' && <ProductDetail />}
      {screen === 'cart' && <Cart />}
      {screen === 'checkout' && <Checkout />}
    </>
  )
}
export default App
