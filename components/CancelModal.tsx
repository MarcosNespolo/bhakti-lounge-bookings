import { ArrowPathIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

type InputCodeModalType = {
    isOpen: boolean
    bookingId: string
    onAction: () => void
    closeModal: () => void
}

export function CancelModal({ isOpen, bookingId, onAction, closeModal }: InputCodeModalType) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [code, setCode] = useState<string>('')
    const [error, setError] = useState<string>('')

    async function cancelBooking(bookingId: string, code: string) {
        setIsLoading(true)
        const url = `http://localhost:3002/api/cancel`
        await Promise.all([fetch(url, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({
                bookingId: bookingId,
                code: code
            })
        })]).then(result => {
            setIsLoading(false)
            if (result[0].status >= 400) {
                setError("We had an issue. Please contact the manager.")
            }
            return result[0].json()
        }).then((result) => {
            if (result.message) {
                setError(result.message)
            } else {
                onAction()
                closeModal()
            }
        })
    }

    return (
        !isOpen ? <></> :
            <div className="fixed inset-0 overflow-y-auto flex items-center justify-center bg-gray-500/70 z-50">
                <div className="flex flex-col gap-4 h-fit w-full max-w-sm m-auto items-center z-50 p-4 sm:p-6 bg-white shadow-lg border-gray-200 rounded-lg">
                    {isLoading
                        ? <ArrowPathIcon className={'animate-spin text-gray-200 mx-auto my-4 h-12 w-12'} />
                        : <>
                            <p className='text-sm font-semibold -mb-3'>Please, enter the manager's code to confirm the cancellation of this booking</p>
                            <input
                                type="text"
                                className='text-sm w-full h-10 border border-gray-200 text-gray-600 rounded-md p-2 hover:border-primary active:border-primary focus:border-primary focus:outline-none focus:ring-0'
                                name="data"
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                            />
                            <div className='flex flex-col gap-2 w-full mt-4'>
                                <button
                                    className={`h-11 w-full flex flex-row items-center justify-center relative py-2 rounded-lg text-white opacity-90 shadow font-semibold
                                        ${code == ''
                                            ? 'bg-gray-400'
                                            : 'bg-red-700 hover:opacity-100'}
                                        `}
                                    onClick={() => cancelBooking(bookingId, code)}
                                    disabled={code == '' || isLoading}
                                >
                                    {false
                                        ? <ArrowPathIcon className={'animate-spin h-4 w-4'} />
                                        : <p>Cancel Reservation</p>
                                    }
                                </button>
                                <button
                                    className={`h-11 w-full flex flex-row items-center justify-center relative py-2 rounded-lg text-gray-800 font-semibold opacity-90 shadow border bg-white border-gray-400 hover:border-primary hover:text-primary`}
                                    onClick={() => { closeModal(); setError(''); setCode('') }}
                                    disabled={isLoading}
                                >
                                    <p>Back</p>
                                </button>
                                {error != '' &&
                                    <p className='p-2 rounded-lg w-full bg-red-50 text-red-800 text-sm font-medium'>
                                        {error}
                                    </p>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
    )
}

export default CancelModal
