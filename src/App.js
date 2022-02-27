import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { Route } from 'react-router-dom'
import axios from 'axios'
import { Header } from './components/Header'
import { Drawer } from './components/Drawer'
import { Home } from './pages/Home'
import { Favorites } from './pages/Favorites'
import AppContext from './context'

import './App.css'

// const items = [
//   { title: "Мужские Кроссовки Nike Blazer Mid Suede", price: 12999, imageUrl: "/img/sneakers/1.jpg" },
//   { title: "Мужские Кроссовки Nike Air Max 270", price: 15600, imageUrl: "/img/sneakers/2.jpg" },
//   { title: "Мужские Кроссовки Nike Air Max 270", price: 15600, imageUrl: "/img/sneakers/3.jpg" },
//   { title: "Мужские Кроссовки Nike Air Max 270", price: 15600, imageUrl: "/img/sneakers/4.jpg" },
// ]

function App() {
	// const [items, setItems] = useState([
	//   {
	//     "title": "Мужские Кроссовки Nike Blazer Mid Suede",
	//     "price": 12999,
	//     "imageUrl": "/img/sneakers/1.jpg"
	//   },
	//   {
	//     "title": "Мужские Кроссовки Nike Air Max 270",
	//     "price": 15600,
	//     "imageUrl": "/img/sneakers/2.jpg"
	//   },
	//   {
	//     "title": "Мужские Кроссовки Nike Air Max 270",
	//     "price": 15600,
	//     "imageUrl": "/img/sneakers/3.jpg"
	//   },
	//   {
	//     "title": "Мужские Кроссовки Nike Air Max 270",
	//     "price": 15600,
	//     "imageUrl": "/img/sneakers/4.jpg"
	//   },
	//   {
	//     "title": "Мужские Кроссовки Nike Blazer Mid Suede",
	//     "price": 12999,
	//     "imageUrl": "/img/sneakers/1.jpg"
	//   },
	//   {
	//     "title": "Мужские Кроссовки Nike Air Max 270",
	//     "price": 15600,
	//     "imageUrl": "/img/sneakers/2.jpg"
	//   },
	//   {
	//     "title": "Мужские Кроссовки Nike Air Max 270",
	//     "price": 15600,
	//     "imageUrl": "/img/sneakers/3.jpg"
	//   },
	//   {
	//     "title": "Мужские Кроссовки Nike Air Max 270",
	//     "price": 15600,
	//     "imageUrl": "/img/sneakers/4.jpg"
	//   },
	// ]);

	const [items, setItems] = useState([])
	const [cartItems, setCartItems] = useState([])
	const [favorites, setFavorites] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const [cartOpened, setCartOpened] = useState(false)
	const [isReadyLoading, setIsReadyLoading] = useState(true)

	useEffect(() => {
		// fetch("https://62094c846df46f0017f4c482.mockapi.io/items")
		//   .then((res) => {
		//     return res.json();
		//   })
		//   .then((json) => {
		//     setItems(json);
		//   });
		async function fetchData() {
			const itemsResponse = await axios.get(
				'https://62094c846df46f0017f4c482.mockapi.io/items',
			)

			const cartResponse = await axios.get(
				'https://62094c846df46f0017f4c482.mockapi.io/cart',
			)

			const favotesResponse = await axios.get(
				'https://62094c846df46f0017f4c482.mockapi.io/favorites',
			)
			setIsReadyLoading(false)
			setCartItems(cartResponse.data)
			setFavorites(favotesResponse.data)
			setItems(itemsResponse.data)
		}
		fetchData()
	}, [])

	const onAddToCart = product => {
		if (cartItems.find(item => Number(item.id) === Number(product.id))) {
			setCartItems(prev =>
				prev.filter(item => Number(item.id) !== Number(product.id)),
			)
		} else {
			axios.post('https://62094c846df46f0017f4c482.mockapi.io/cart', product)
			setCartItems(prev => [...prev, product])
		}
	}

	const onRemoveItem = id => {
		axios.delete(`https://62094c846df46f0017f4c482.mockapi.io/cart/${id}`)
		setCartItems(prev => prev.filter(item => item.id !== id))
	}

	const onAddToFavorite = async obj => {
		try {
			if (favorites.find(favObj => favObj.id === obj.id)) {
				axios.delete(
					`https://62094c846df46f0017f4c482.mockapi.io/favorites/${obj.id}`,
				)
				setFavorites(prev =>
					prev.filter(item => Number(item.id) !== Number(obj.id)),
				)
			} else {
				const { data } = await axios.post(
					'https://62094c846df46f0017f4c482.mockapi.io/favorites',
					obj,
				)
				setFavorites(prev => [...prev, data])
			}
		} catch (error) {
			alert('Не удалось добавить в фавориты')
		}
	}

	const onChangeSearchInput = event => {
		setSearchValue(event.target.value)
	}

	const isItemAdded = id => {
		return cartItems.some(obj => Number(obj.id) === Number(id))
	}

	return (
		<AppContext.Provider
			value={{
				items,
				cartItems,
				favorites,
				isItemAdded,
				setCartOpened,
				setCartItems,
				onAddToFavorite,
			}}
		>
			<div className='wrapper clear'>
				{cartOpened && (
					<Drawer
						items={cartItems}
						onClose={() => setCartOpened(false)}
						onRemove={onRemoveItem}
					/>
				)}
				<Header onClickCart={() => setCartOpened(true)} />

				<Route path='/' exact>
					<Home
						items={items}
						cartItems={cartItems}
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						onChangeSearchInput={onChangeSearchInput}
						onAddToFavorite={onAddToFavorite}
						onAddToCart={onAddToCart}
						isReadyLoading={isReadyLoading}
					/>
				</Route>
				<Route path='/favorites' exact>
					<Favorites />
				</Route>
			</div>
		</AppContext.Provider>
	)
}

export default App
