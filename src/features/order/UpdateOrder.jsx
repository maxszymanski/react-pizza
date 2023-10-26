import { useFetcher } from 'react-router-dom'
import Button from '..//../ui/Button'
import { updateOrder } from '../../services/apiRestaurant'
function UpdateOrder({ order }) {
    const fetcher = useFetcher()

    //używamy komponentu fetcher.Form do zmiany, ale ten Form nie nawiguję dalej, revaliduje stronę, dobre do updatowania jakich rzeczy
    return (
        <fetcher.Form method="PATCH" className="text-right">
            <Button type="primary">Make Priority</Button>
        </fetcher.Form>
    )
}

export default UpdateOrder
// params daje nam informacje o current URL, które w tym rodzaju zawiera orderID
export async function action({ request, params }) {
    const data = { priority: true }
    await updateOrder(params.orderID, data)
    //updateOrder porzebuje orderID i daty tylko to co zmieniamy
    return null
}
