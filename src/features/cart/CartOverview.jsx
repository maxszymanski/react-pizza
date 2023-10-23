import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getTotalCardPrice, getTotalCartQuantity } from './cartSlice'
import { formatCurrency } from '../../utils/helpers'

function CartOverview() {
    // za pomocą useSelectora pobieramy dane z redux i od razy za pomocą funcki reduce wyliczmy ile jest pizz wybranych.   Przenieśliśmy ten stan do cartSlice alby był w jednym pliku
    const totalCartQuantity = useSelector(getTotalCartQuantity)
    const totalCartPrice = useSelector(getTotalCardPrice)

    if (!totalCartQuantity) return null
    return (
        <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
            <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6 ">
                <span>{totalCartQuantity} pizzas</span>
                <span>{formatCurrency(totalCartPrice)}</span>
            </p>
            <Link
                className=" transition-colors duration-300 hover:text-yellow-500"
                to="/cart"
            >
                Open cart &rarr;
            </Link>
        </div>
    )
}

export default CartOverview
