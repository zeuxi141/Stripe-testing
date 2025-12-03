import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AuthorizePage from './AuthorizePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <Link to="/">Home</Link> | <Link to="/authorize">Test Authorize</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authorize" element={<AuthorizePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <h1>🧪 Stripe Connect OAuth Test</h1>
      <p><a href="/authorize">Click /authorize → Xem raw HTML từ Stripe</a></p>
    </div>
  );
}

export default App;
