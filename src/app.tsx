import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ThemeProvider from './providers/theme'
import AppRoutes from './routes'

export const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <AppRoutes />
    </QueryClientProvider>
  )
}

export default App
