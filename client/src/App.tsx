import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, SearchResults } from './pages';

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/search' element={<SearchResults />} />
			</Routes>
		</>
	);
}

export default App;
