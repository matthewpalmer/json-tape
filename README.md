# node-command-player

Replays a command log on an initial state.

## Getting Started

node-command-player lets you apply a sequence of commands to an initial state.
The format of the commands and the application of those commands to the state is customisable via the `tokenizer` and `instructionSet` parameters respectively.

We also came up with a low level method for applying operations to a JSON object which is caled `json_asm` which might be interesting, details are at the bottom.
(Note that node-command-player doesn't require that you use `json_asm` instruction set or the `plain_text_delimiters` log format—they are there as example).

Looking at an example command log (a simplification of `/tests/sample_log.txt`), we might have some `json_asm` commands to replay on the initial state.

```text
// Commands
store:results[0]:weight:4
add:results[0]:weight:results[0].weight:2

// Initial state
{
	results: [{ weight: 200 }, { weight: 100 }]
}
```

What happens when we run the default log replayer on this log?

- Our log format tokenizer (`plain_text_delimiters`) turns the log into command objects, i.e.
	```js
	[
		{ action: 'store', args: ['results[0]','weight','4'] },
		{ action: 'add', args: ['results[0]','weight','results[0].weight', '2'] }
	]
	```
- The command-player then plays each of these command objects on the state by calling the function matching `action` on the `json_asm` instruction set.
  `json_asm` is responsible for mutating the state and doing futher processing of the arguments to reflect the command called.

And so after running the command-player we end up with the resulting state

```
// After we play each command
{
	results: [{ weight: 6 }, { weight: 100 }]
}
```

### `json_asm`

`json_asm` is a little instruction format that allows for efficient mutation of a 
JSON object by specifying changes with simple commands (`load`, `store`, `add`, `sort`, etc.).
It's not required to use node-command-player, but it's kind of interesting.

Look at the following command specified using `json_asm` and the `plain_text_delimiters` log format

```
add:results[0]:weight:results[0].weight:2
```

- `add` is the action, i.e. the opcode
- `results[0]` through to `2` are the arguments passed to the `json_asm.add()` function
- `results[0]` and `weight` provide the location to which the result should be stored 
	(L-values need to be specified with the path to the parent object separate from the property to set so that we can reliably find the object to mutate,
	while R-values are specified with the full path, i.e. `results[0]:weight` for the L-value, `results[0].weight` for the R-value)
- `results[0].weight` and `2` are the operands for `add`. `json_asm` will dereference pointers and convert values to their true JavaScript object as necessary.
	String literal operands need to be wrapped in quotes—unquoted strings are treated as pointers
