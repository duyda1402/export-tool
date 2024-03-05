import { Container, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <ModalsProvider>
      <Container>
        <App />
      </Container>
    </ModalsProvider>
  </MantineProvider>
)
