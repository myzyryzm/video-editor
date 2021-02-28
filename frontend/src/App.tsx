/** @format */

import React from 'react'
import AppInner from './AppInner'
import GlobalContext from './components/Global/GlobalContext'
import useGlobal from './components/Global/useGlobal'

export default function App() {
    const global = useGlobal()
    return (
        <GlobalContext.Provider value={global}>
            <AppInner />
        </GlobalContext.Provider>
    )
}
