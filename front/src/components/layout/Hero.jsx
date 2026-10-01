function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundImage:
          'linear-gradient(rgba(143,18,104,0.55), rgba(143,18,104,0.75)), url(https://st.depositphotos.com/3006519/4596/i/450/depositphotos_45960435-stock-photo-gold-jewelry.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'var(--color-text)',
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', margin: 0, letterSpacing: '2px', color: '#fff' }}>        ALMĀS
      </h1>
      <p style={{ fontFamily: 'var(--font-script)', color: 'var(--color-accent)', fontSize: '2rem', margin: '0.25rem 0' }}>
        aljawahiriu
      </p>
      <p style={{ fontStyle: 'italic', maxWidth: '500px', opacity: 0.9, color: '#fff' }}>
        you can't buy happiness but you can buy jewellery and that's pretty close
      </p>
    </section>
  )
}
export default Hero