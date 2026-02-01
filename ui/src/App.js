import './App.css';
import "milligram";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MoviesPage from "./MoviesPage";
import ActorsPage from "./ActorsPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Router>
            <div>
                <nav style={{ padding: '20px', backgroundColor: '#f4f5f6', marginBottom: '20px' }}>
                    <Link to="/" style={{ marginRight: '20px' }}>Movies</Link>
                    <Link to="/actors">Actors</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<MoviesPage />} />
                    <Route path="/actors" element={<ActorsPage />} />
                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </Router>
    );
}

export default App;
