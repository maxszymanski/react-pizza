import { Link } from 'react-router-dom'

function CartOverview() {
    return (
        <div className="bg-stone-800 p-4 uppercase text-stone-200">
            <p className="space-x-4 font-semibold text-stone-300  ">
                <span>23 pizzas</span>
                <span>$23.45</span>
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
