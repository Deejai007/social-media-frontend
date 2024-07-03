import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { Provider } from 'react-redux'

import { store, persistor } from './redux/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import App from 'components/App'
import { ToastContainer } from 'react-toastify'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <App />
    </PersistGate>
  </Provider>
)
