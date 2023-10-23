import { useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { createOrder } from '../../services/apiRestaurant'
import Button from '../../ui/Button'
import { useSelector } from 'react-redux'
import { getCart, getTotalCardPrice } from '../cart/cartSlice'
import EmptyCart from '../cart/EmptyCart'
import store from '../../store'
import { clearCart } from '../cart/cartSlice'
import { formatCurrency } from '../../utils/helpers'

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    )

// const fakeCart = [
//     {
//         pizzaId: 12,
//         name: 'Mediterranean',
//         quantity: 2,
//         unitPrice: 16,
//         totalPrice: 32,
//     },
//     {
//         pizzaId: 6,
//         name: 'Vegetale',
//         quantity: 1,
//         unitPrice: 13,
//         totalPrice: 13,
//     },
//     {
//         pizzaId: 11,
//         name: 'Spinach and Mushroom',
//         quantity: 1,
//         unitPrice: 15,
//         totalPrice: 15,
//     },
// ]

function CreateOrder() {
    const [withPriority, setWithPriority] = useState(false)
    const cart = useSelector(getCart)
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'
    const formErrors = useActionData()
    const username = useSelector((state) => state.user.userName)
    const totalCartPrice = useSelector(getTotalCardPrice)
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
    const totalPrice = totalCartPrice + priorityPrice
    if (!cart.length) return <EmptyCart />

    return (
        <div className="px-4 py-6">
            <h2 className="mb-8 text-xl font-semibold">
                Ready to order? Let's go!
            </h2>
            {/* Form from react-router  we can easy send data to server  */}
            <Form method="POST">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <div className="grow">
                        <input
                            type="text"
                            name="customer"
                            className="input"
                            defaultValue={username}
                            required
                        />
                        {formErrors?.customer && (
                            <p className="mt-2 rounded-full bg-red-100 p-2 text-center text-xs text-red-700">
                                {formErrors.customer}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <input
                            className="input"
                            type="tel"
                            name="phone"
                            required
                        />
                        {formErrors?.phone && (
                            <p className="mt-2 rounded-full bg-red-100 p-2 text-center text-xs text-red-700">
                                {formErrors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input
                            type="text"
                            name="address"
                            required
                            className="input"
                        />
                    </div>
                </div>

                <div className="mb-12 flex items-center gap-5">
                    <input
                        type="checkbox"
                        name="priority"
                        id="priority"
                        className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                        value={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label htmlFor="priority" className="font-medium">
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    <input
                        type="hidden"
                        name="cart"
                        value={JSON.stringify(cart)}
                    />
                    <Button type="primary" disabled={isSubmitting}>
                        {' '}
                        {isSubmitting
                            ? 'Pacing order...'
                            : `Order now for ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export async function action({ request }) {
    /// we conected this in app to action
    const formData = await request.formData() // posting data
    const data = Object.fromEntries(formData) /// we crate a object with constructor formData()
    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === 'true',
    }

    const errors = {} // we create an error if the form have valid information
    if (!isValidPhone(order.phone))
        errors.phone =
            'Please give us your correct phone number. We might need it to contact you'
    if (order.customer.length < 2) errors.customer = 'You name is too short'
    if (Object.keys(errors).length > 0) return errors

    // if everythink is ok create new order
    const newOrder = await createOrder(order)

    // nie uzywać za duzo tego
    store.dispatch(clearCart()) // czyścimy katrę z zamówieniami po zamówieniu. Musimy iportować cały store i wywołać w action bezpośrednio dispatch

    return redirect(`/order/${newOrder.id}`) // dont use useNavigate but redirect to navigate if form is true
}
export default CreateOrder
