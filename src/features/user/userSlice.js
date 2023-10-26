import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAddress } from '../../services/apiGeocoding'

function getPosition() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

export const fetchAddress = createAsyncThunk(
    ///nie nazywać tego od get
    'user/fetchAdress', //pierwysz argument action type
    async function () {
        // tnukt function async funkcja gdy odołamy sie do thunk
        // 1) We get the user's geolocation position
        const positionObj = await getPosition()
        console.log(positionObj)
        const position = {
            latitude: positionObj.coords.latitude,
            longitude: positionObj.coords.longitude,
        }

        // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
        const addressObj = await getAddress(position)
        const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`

        // 3) Then we return an object with the data that we are interested in//
        // Payload of the FULFIELLD STATE!!!! to zwracamy w fulfielld jako payload
        return { position, address }
    }
)

const initialState = {
    userName: '',
    status: 'idle',
    position: {},
    address: '',
    error: '',
}

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateName(state, action) {
            state.userName = action.payload
        },
    },
    extraReducers: (
        builder // to musimy dodać do thunks aby odwołać sie do funckcji fetchAdress i dodajemy, potem odwołujemy suie jak w reducers do state i action
    ) =>
        builder
            .addCase(fetchAddress.pending, (state, action) => {
                // case pending to gdy czekamy na dane
                state.status = 'loading'
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                // case fulfiled gdy dane dotarły
                state.status = 'idle'
                state.position = action.payload.position
                state.address = action.payload.address
            })
            .addCase(fetchAddress.rejected, (state, action) => {
                // case rejected gdy jest jakis problem z danymi
                state.status = 'error'
                state.error =
                    'There was a problem getting your address. Make sure to fill this field!'
            }),
})

export const { updateName } = UserSlice.actions

export default UserSlice.reducer
