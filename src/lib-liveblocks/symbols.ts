import { InjectionKey } from 'vue'

// Symbols are used for provide/inject to avoid polluting the global scope
export const clientSymbol = Symbol() as InjectionKey<string>
export const roomSymbol = Symbol() as InjectionKey<string>
