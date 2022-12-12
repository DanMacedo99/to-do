import { createRoot } from 'react-dom/client'

import { App } from '~/app'

if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser')

  worker.start()
}

const container = document.getElementById('app')
const root = createRoot(container!)

root.render(<App />)
