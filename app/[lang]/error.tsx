'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1>Chyba</h1>
      <button onClick={reset}>Zkusit znovu</button>
    </div>
  )
}
