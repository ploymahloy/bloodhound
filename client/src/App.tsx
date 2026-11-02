import { Routes, Route } from 'react-router-dom';
import { Navbar, ProtectedRoute } from './components';
import { CreateListing, Health, Home, Login, SearchResults } from './pages';
import './App.css';

const App = () => {
	return (
		<div className='App'>
			<Navbar />
			<main className='App-main'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/search' element={<SearchResults />} />
					<Route
						path='/listings/new'
						element={
							<ProtectedRoute>
								<CreateListing />
							</ProtectedRoute>
						}
					/>
					<Route path='/login' element={<Login />} />
					<Route path='/health' element={<Health />} />
				</Routes>
			</main>
		</div>
	);
};

export default App;
