function Skeleton({ width = '100%', height = '20px' }) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderRadius: '4px',
        animation: 'pulse 1.2s ease-in-out infinite',
      }}
    />
  )
}

export default Skeleton