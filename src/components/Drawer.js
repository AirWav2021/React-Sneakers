import React, { useContext, useState } from 'react'
import { Info } from './Info'
import AppContext from '../context'
import axios from 'axios'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const Drawer = ({ onClose, onRemove, items = [] }) => {
	const { cartItems, setCartItems } = useContext(AppContext)
	const { orderId, setOrderId } = useState(null)
	const [isOrderComplete, setIsOrderComplete] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const onClickOrder = async () => {
		try {
			setIsLoading(true)
			const { data } = await axios.post(
				'https://62094c846df46f0017f4c482.mockapi.io/orders',
				{ items: cartItems },
			)
			setOrderId(data.id)
			setIsOrderComplete(true)
			setCartItems([])

			for (let i = 0; i < cartItems.length; i++) {
				const item = cartItems[i]
				await axios.delete('/cart/' + item.id)
				await delay(1000)
			}
		} catch (error) {
			alert('Не удалось создать заказ')
		}
		setIsLoading(false)
	}

	return (
		<div className='overlay'>
			<div className='drawer'>
				<h2 className='d-flex justify-between mb-30'>
					Корзина
					<img
						onClick={onClose}
						className='removeBtn cu-p'
						src='/img/btn-remove.svg'
						alt='Close'
					/>
				</h2>

				{items.length > 0 ? (
					<>
						<div className='items'>
							{items.map(obj => (
								<div
									key={obj.id}
									className='cartItem d-flex align-center mb-20'
								>
									<div
										style={{ backgroundImage: `url(${obj.imageUrl})` }}
										className='cartItemImg'
									></div>
									<div className='mr-20 d-flex'>
										<p className='mb-5'>{obj.title}</p>
										<b>{obj.price}</b>
									</div>
									<img
										onClick={() => onRemove(obj.id)}
										className='removeBtn'
										src='/img/btn-remove.svg'
										alt='Remove'
									/>
								</div>
							))}
						</div>
						<div className='cartTotalBlock'>
							<ul>
								<li>
									<span>Итого:</span>
									<div></div>
									<b>21 500 руб.</b>
								</li>
								<li>
									<span>Налог 5%:</span>
									<div></div>
									<b>1074 руб.</b>
								</li>
							</ul>
							<button
								disabled={isLoading}
								onClick={onClickOrder}
								className='greenButton'
							>
								Оформить заказ <img src='/img/arrow.svg' alt='Arrow' />
							</button>
						</div>
					</>
				) : (
					<Info
						title={isOrderComplete ? 'Заказ оформлен' : 'Корзина пустая'}
						description={
							isOrderComplete
								? `Ваш заказ ${orderId} скоро будет передан курьерской доставке`
								: 'Добавьте товарый в корзину'
						}
						image={
							isOrderComplete
								? '/img/complete-order.jpg'
								: '/img/empty-cart.jpg'
						}
					/>
				)}
			</div>
		</div>
	)
}