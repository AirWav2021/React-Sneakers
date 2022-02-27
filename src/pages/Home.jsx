import React, { useContext } from 'react'
import { Card } from '../components/Card'
export const Home = ({
	items,
	searchValue,
	setSearchValue,
	onChangeSearchInput,
	onAddToFavorite,
	onAddToCart,
	isReadyLoading,
}) => {
	// const { isItemAdded } = useContext(AppContext)

	const renderItems = () => {
		const filteredItems = items.filter(item =>
			item.title.toLowerCase().includes(searchValue.toLowerCase()),
		)

		return (isReadyLoading ? [...Array(8)] : filteredItems).map(
			(item, index) => (
				<Card
					key={index}
					onFavorite={obj => onAddToFavorite(obj)}
					onPlus={product => onAddToCart(product)}
					// added={isItemAdded(item && item.id)}
					loading={isReadyLoading}
					{...item}
				/>
			),
		)
	}
	return (
		<div className='content p-40'>
			<div className='d-flex align-center justify-between mb-40'>
				<h1>
					{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}
				</h1>
				<div className='search-block d-flex'>
					<img src='/img/search.svg' alt='Search' />
					{searchValue && (
						<img
							onClick={() => setSearchValue('')}
							className='clear cu-p'
							src='/img/btn-remove.svg'
							alt='Close'
						/>
					)}
					<input
						onChange={onChangeSearchInput}
						value={searchValue}
						type='text'
						placeholder='Поиск ...'
					/>
				</div>
			</div>
			<div className='sneakers-cards d-flex flex-wrap'>{renderItems()}</div>
		</div>
	)
}
