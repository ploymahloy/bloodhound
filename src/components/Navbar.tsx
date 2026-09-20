import { useState, type KeyboardEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/cn';
import './Navbar.css';

const MENU_ID = 'navbar-menu';

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	function closeMenu() {
		setIsOpen(false);
	}

	function toggleMenu() {
		setIsOpen(open => !open);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		if (event.key === 'Escape' && isOpen) {
			closeMenu();
		}
	}

	return (
		<div onKeyDown={handleKeyDown}>
			<header className='Navbar'>
				<NavLink to='/' className='Navbar-brand' end>
					Legato
				</NavLink>
				<button
					type='button'
					className='Navbar-menuButton'
					aria-expanded={isOpen}
					aria-controls={MENU_ID}
					aria-label={isOpen ? 'Close menu' : 'Open menu'}
					onClick={toggleMenu}>
					{isOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
				</button>
			</header>

			<div
				className={cn('Navbar-overlay', isOpen && 'Navbar-overlay--open')}
				onClick={closeMenu}
				aria-hidden={!isOpen}
			/>

			<aside
				id={MENU_ID}
				className={cn('Navbar-drawer', isOpen && 'Navbar-drawer--open')}
				role='dialog'
				aria-modal={isOpen}
				aria-label='Menu'
				aria-hidden={!isOpen}
				inert={!isOpen}>
				{isOpen && (
					<nav className='Navbar-nav' aria-label='Site'>
						<NavLink
							to='/'
							end
							autoFocus
							className={({ isActive }) => cn('Navbar-link', isActive && 'Navbar-link--active')}
							onClick={closeMenu}>
							Home
						</NavLink>
						<NavLink
							to='/search'
							className={({ isActive }) => cn('Navbar-link', isActive && 'Navbar-link--active')}
							onClick={closeMenu}>
							Search
						</NavLink>
						<a
							href='#'
							className='Navbar-link'
							onClick={event => {
								event.preventDefault();
								closeMenu();
							}}>
							Log In
						</a>
					</nav>
				)}
			</aside>
		</div>
	);
}
