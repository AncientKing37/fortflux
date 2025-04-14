
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use the non-null assertion operator to ensure that root element exists
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(<App />);
