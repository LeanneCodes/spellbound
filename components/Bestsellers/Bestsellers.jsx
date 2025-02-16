import React from 'react'
import BookCard from '../BookCard/BookCard'

const Bestsellers = () => {
  return (
    <div>
        <div className='flex w-full justify-between'>
            <h2>Bestsellers</h2>
            <button>See all</button>
        </div>

        <div>
            <BookCard />
        </div>
    </div>
  )
}

export default Bestsellers
