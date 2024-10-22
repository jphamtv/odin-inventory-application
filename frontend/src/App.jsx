// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryList from './components/categories/CategoryList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<CategoryList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
