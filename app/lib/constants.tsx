export const VEHICLE_ID = {
    CAR: 1,
    VAN: 2,
    MINIVAN: 3,
    CAR_NEW: 4,
}

export const vehicleOptions = [
    {
        id: VEHICLE_ID.CAR,
        name: 'Old car',
        image: '/car.png',
        enabled: false
    },
    {
        id: VEHICLE_ID.VAN,
        name: 'Van',
        image: '/van.png',
        enabled: true
    },
    {
        id: VEHICLE_ID.MINIVAN,
        name: 'Minivan',
        image: '/minivan.png',
        enabled: false
    },
    {
        id: VEHICLE_ID.CAR_NEW,
        name: 'Car',
        image: '/car2.png',
        enabled: true
    },
]