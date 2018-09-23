This is a simple test that will be deprecated or deleted. First step in making sure I can develop build_jsfiddle_demos into a npm tool!

Please log an issue to my repository if you see this and I will promptly remove it. Appologies!

	https://github.com/tamusjroyce/build_jsfiddle_demos/issues

A cross-platform node tool that builds fiddle.js appropriate demo folders based on each html file found.
The html file has all <link rel=\"import\" href=\"/path/to/file.html\" /> replaced with the linked file contents.
It also does its best to combines all locally referenced css files into demo.css. And javascript files as demo.js.
It also adds a blank demo.details file if one does not exist.
