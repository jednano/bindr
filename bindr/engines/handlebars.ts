///<reference path='../vendor/dt-node/node.d.ts'/>


export function compile(source: string) {
	return {
		done: require('handlebars').compile(source)
	};
}
