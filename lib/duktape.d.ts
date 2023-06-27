/**
 * Allows access to the duktape object.
 */
declare const Duktape: Duktape;

/**
 * Allows acces to the duktape exposed performance timing api.
 * @see {@link https://duktape.org/guide.html#builtin-performance}
 */
declare const performance: Performance;


/**
 * Allows access to the duktape object.
 * @see {@link https://duktape.org/guide.html#builtin-duktape}
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
 * @see {@link https://duktape.org/guide.html#builtin-duktape-act}
 */
interface DukStackEntry
{
	function: DukFunction;
	lineNumber: number;
	pc: number;
}


/**
 * A reference to a standard ES5 function in Duktape.
 * @see {@link https://duktape.org/guide.html#ecmascript-function-properties}
 */
interface DukFunction extends Function
{
	name: string;
	fileName: string;
}


/**
 * Allows acces to the duktape exposed performance timing api.
 * @see {@link https://duktape.org/guide.html#builtin-performance}
 */
interface Performance
{
	/**
	 * Gets the monotonic time in milliseconds, including fractions.
	 */
	now(): number;
}