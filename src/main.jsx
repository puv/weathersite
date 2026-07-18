import './css/index.css'

import App from './App'
import { AppProvider } from './util/AppContext'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')).render(
	<AppProvider>
		<App />
	</AppProvider>,
)
