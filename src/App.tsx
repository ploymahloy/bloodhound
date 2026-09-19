import { Routes, Route } from 'react-router-dom';
import { Home, SearchResults } from './pages';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/search' element={<SearchResults />} />
		</Routes>
	);
}

export default App;
