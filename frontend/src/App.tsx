import Header from './components/Header'
import Home from './components/Home'
import Disclaimer from './components/Disclaimer'
import Footer from './components/Footer'
import { RouterProvider, useRouter } from './lib/router'

function Body() {
  const { path } = useRouter()
  return path === '/disclaimer' ? <Disclaimer /> : <Home />
}

export default function App() {
  return (
    <RouterProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Header />
        <main>
          <Body />
        </main>
        <Footer />
      </div>
    </RouterProvider>
  )
}
