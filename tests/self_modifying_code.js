// Self modifying code

const assert = require('assert');
const fs = require('fs');
const replayer = require('../tape_player')();

const state = {};

const commands = 
`
# Just add whatever value, we'll use it later
store:/test2:5

# Add a new command at the end -- this is not executed until after
# everything else!
splice:/__statements__:/__statements__/length:0:"store:/test4:7"

# test4 is set to 13, but then the command that we spliced
# in above will run and overwrites test4
store:/test4:13

# Let's try something... if/else without jumps, only self-modifying code
# if (test2 == 5) {
#   condition = 555  
# } else {
#   condition = 666  
# }

if_not_equal:/test2:5:"splice:/__statements__:/__index__:2"
store:/condition:555
splice:/__statements__:/__index__:1
store:/condition:666
`;
module.exports = (done) => {
  replayer.play(commands, state, (error, mutated) => {
    assert(mutated.test2 == 5);
    assert(mutated.test4 == 7);
    assert(mutated.condition == 555)
    console.log('Self-modifying tape passed');
    done();
  });
}
