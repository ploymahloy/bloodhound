import { Routes, Route } from 'react-router-dom';
import { SearchResults } from './pages';

function App() {
	return (
		<Routes>
			<Route path='/' element={<SearchResults />} />
		</Routes>
	);
}

export default App;
