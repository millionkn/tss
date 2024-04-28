import tsNode from 'ts-node'

export const service = tsNode.create()
export const hooks = tsNode.createEsmHooks(service)