function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '1rem',
        color: 'var(--color-text)',
        opacity: 0.7,
        fontSize: '0.85rem',
      }}
    >
      © {new Date().getFullYear()} ALMĀS joyería artesanal
    </footer>
  )
}

export default Footer