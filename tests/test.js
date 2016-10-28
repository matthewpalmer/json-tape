console.log('Running tests…');
require('./default_formats')(_ => {
	require('./custom_formats')(_ => {
		require('./plain_text_delimiters')(_ => {
			console.log('Tests passed');		
		});		
	});
});
