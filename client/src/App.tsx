import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Health, Home, Login, SearchResults } from './pages';

const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/search' element={<SearchResults />} />
				<Route path='/login' element={<Login />} />
				<Route path='/health' element={<Health />} />
			</Routes>
		</>
	);
};

export default App;
