
export const CenterPoint = () => {
  return (
    <mesh position={[0, 0.11, 0]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}
