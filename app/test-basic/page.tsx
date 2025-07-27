"use client"

import { useState } from "react"

export default function TestBasic() {
  const [count, setCount] = useState(0)
  const [showDiv, setShowDiv] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Basic React Test</h1>

      <div className="space-y-4">
        <div>
          <button onClick={() => setCount(count + 1)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Count: {count}
          </button>
        </div>

        <div>
          <button onClick={() => setShowDiv(!showDiv)} className="bg-green-500 text-white px-4 py-2 rounded">
            Toggle Div
          </button>
          {showDiv && <div className="mt-2 p-4 bg-gray-100 border">This div is showing!</div>}
        </div>
      </div>
    </div>
  )
}
