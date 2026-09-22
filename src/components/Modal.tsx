import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';
import './Modal.css';

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	className?: string;
	children: ReactNode;
};

export function Modal({ isOpen, onClose, title, className, children }: ModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				onClose();
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const titleId = title ? 'modal-title' : undefined;

	return (
		<div
			className='Modal-overlay'
			onClick={event => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}>
			<div className={cn('Modal-dialog', className)} role='dialog' aria-modal='true' aria-labelledby={titleId}>
				<div className='Modal-header'>
					{title && (
						<h2 id={titleId} className='Modal-title'>
							{title}
						</h2>
					)}
					<button type='button' className='Modal-close' onClick={onClose} aria-label='Close profile details'>
						<X size={20} aria-hidden />
					</button>
				</div>
				<div className='Modal-body'>{children}</div>
			</div>
		</div>
	);
}
