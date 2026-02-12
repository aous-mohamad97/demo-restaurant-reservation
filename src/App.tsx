import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { routes } from './routes';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </LanguageProvider>
    </Router>
  );
}

export default App;
