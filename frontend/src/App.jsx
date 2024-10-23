// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import Header from './components/Header';
import CategoryForm from './components/CategoryForm';
import ItemForm from './components/ItemForm';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/:id/edit" element={<CategoryForm />} />
          <Route path="/items/new" element={<ItemForm />} />
          <Route path="/items/:id/edit" element={<ItemForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
