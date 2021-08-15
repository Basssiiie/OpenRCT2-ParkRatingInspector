/**
 * Allows access to the duktape object.
 * Reference: https://duktape.org/guide.html#builtin-duktape
 */
declare const Duktape: Duktape;


/**
 * Allows access to the duktape object.
 * Reference: https://duktape.org/guide.html#builtin-duktape
 */
interface Duktape
{
	/**
	 * Returns an entry on the call stack.
	 */
	act(depth: number): DukStackEntry;


	/**
	 * Callback that gets triggered after an ECMAScript error has occured.
	 */
	errCreate: (e: Error) => Error;
}


/**
 * An entry on the call stack.
 * Reference: https://duktape.org/guide.html#builtin-duktape-act
 */
interface DukStackEntry
{
	function: Function;
	lineNumber: number;
	pc: number;
}