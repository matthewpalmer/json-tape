console.log('Running tests…');
require('./default_formats')(_ => {
	require('./plain_text_delimiters')(_ => {
    require('./self_modifying_code')(_ => {
      console.log('Tests passed');
    });
	});		
});
