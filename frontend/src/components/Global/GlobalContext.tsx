/** @format */

import { createContext } from 'react'
import { GlobalHook } from './commonRequirements'

const GlobalContext = createContext<GlobalHook>({} as GlobalHook)
export default GlobalContext
