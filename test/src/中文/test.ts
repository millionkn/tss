import ts from 'typescript'
import { rollup } from 'rollup'
import { test2 } from '../test2'
import { test3 } from '@src/test3'


console.log(
	!!test2,
	!!test3,
	!!ts,
	!!rollup,
)