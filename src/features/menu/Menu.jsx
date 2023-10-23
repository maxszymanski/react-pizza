import { useLoaderData } from 'react-router-dom'
import { getMenu } from '../../services/apiRestaurant'
import MenuItem from './MenuItem'

function Menu() {
    const menu = useLoaderData()

    return (
        <div className="px-2 py-6">
            <h2 className="my-6 text-center text-4xl font-semibold uppercase text-stone-700">
                menu
            </h2>
            <ul className="divide-y-stone-200 mb-12 divide-y ">
                {menu.map((pizza) => (
                    <MenuItem pizza={pizza} key={pizza.id} />
                ))}
            </ul>
        </div>
    )
}

export async function loader() {
    const menu = await getMenu()
    return menu
}

export default Menu
