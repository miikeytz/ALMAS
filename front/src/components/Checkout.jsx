import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { graphqlRequest } from '../graphql/client'

const MUTATION_CREAR_PEDIDO = `
  mutation CrearPedido($data: PedidoInput!) {
    crearPedido(data: $data) {
      id
      estatus
      total
    }
  }
`

function Checkout() {
  const cart = useAppStore((s) => s.cart)
  const goHome = useAppStore((s) => s.goHome)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [direccion, setDireccion] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null)
  const [error, setError] = useState(null)

  const total = cart.reduce((sum, item) => sum + item.precio * (item.cantidad || 1), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)

    const data = {
      nombreComprador: nombre,
      emailComprador: email,
      direccionEnvio: direccion,
      detalles: cart.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad || 1,
        precioUnitario: item.precio,
      })),
    }

    try {
      const result = await graphqlRequest(MUTATION_CREAR_PEDIDO, { data })
      setPedidoConfirmado(result.crearPedido)
    } catch (err) {
      setError('No se pudo registrar el pedido. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const inputStyle = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.7rem 1rem',
    marginBottom: '1rem',
    borderRadius: '10px',
    border: '1px solid rgba(143,18,104,0.6)',
    backgroundColor: 'rgba(143,18,104,0.3)',
    color: 'var(--color-text)',
    fontSize: '1rem',
  }

  if (pedidoConfirmado) {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '3rem auto',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px solid rgba(253,240,220,0.15)',
        }}
      >
        <h2 style={{ color: 'var(--color-gold)' }}>¡Pedido confirmado!</h2>
        <p>Número de pedido: {pedidoConfirmado.id}</p>
        <p>Estatus: {pedidoConfirmado.estatus}</p>
        <p style={{ fontWeight: 600 }}>Total: ${pedidoConfirmado.total}</p>
        <button
          onClick={goHome}
          style={{
            border: 'none',
            background: 'var(--color-gold)',
            color: 'var(--color-bg)',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.7rem 1.4rem',
            borderRadius: '999px',
            marginTop: '1rem',
          }}
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)' }}>Checkout</h2>
      <p style={{ color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1.5rem' }}>
        Total a pagar: ${total}
      </p>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          placeholder="Dirección de envío"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={enviando}
          style={{
            border: 'none',
            background: enviando ? 'rgba(201,162,75,0.5)' : 'var(--color-gold)',
            color: 'var(--color-bg)',
            fontWeight: 600,
            cursor: enviando ? 'not-allowed' : 'pointer',
            padding: '0.7rem 1.4rem',
            borderRadius: '999px',
            width: '100%',
          }}
        >
          {enviando ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>

      {error && <p style={{ color: '#e05252', marginTop: '1rem' }}>{error}</p>}
    </div>
  )
}
export default Checkout