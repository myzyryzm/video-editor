/** @format */

import { createContext } from 'react'
import { TrimHook } from './commonRequirements'

const TrimmingContext = createContext<TrimHook>({} as TrimHook)
export default TrimmingContext
