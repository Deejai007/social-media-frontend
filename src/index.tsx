import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { Provider } from 'react-redux'
import store from '../redux/store/store'
import App from 'components/App'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
