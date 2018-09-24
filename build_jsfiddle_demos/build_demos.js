const fs = require("fs");
const path = require("path");

const util = require("util");
const spawnprocess = require("child_process");

const sanitizeHtml = require('sanitize-html');

function exec(command) {
	let result = "";

	try {
		result = await util.promisify(spawnprocess.exec(command));
	} catch(error) {
		return "error: " + error;
	}

	return result;
}

function GetProjectDirectory() {
	try {
		const npmGlobalPackageDirectory = path.normalize(exec("npm list -g")).toString().toLowerCase();
		const currentDirectory = path.normalize(__dirname).toString().toLowerCase();

		if (currentDirectory.startsWith(npmGlobalPackageDirectory)) {
			return path.normalize(process.cwd());
		}
	} catch(error) {
		console.log("Error was found while getting ProjectDirectory: " + error);
	}

	return "~"; // With wavy, "./node_modules/~" will be a symlink to to the application path.
}

const ProjectDirectory = GetProjectDirectory();

function GetFileEncodingHeader(filePath) {
    const readStream = fs.openSync(filePath, 'r');
    const bufferSize = 2;
    const buffer = new Buffer(bufferSize);
    let readBytes = 0;

    if (readBytes = fs.readSync(readStream, buffer, 0, bufferSize, 0)) {
        const header = buffer.slice(0, readBytes).toString("hex");

        if (header === "fffe") {
            return "utf16le";
        } else if (header === "feff") {
            return "utf16be";
        } else if (header.startsWith("ff") || header.startsWith("fe") || header.startsWith("ef")) {
            return "utf8";
        }
    }

    return "";
}

function ReadFileSync(filePath, desiredEncoding) {
    if (!desiredEncoding || desiredEncoding == null || desiredEncoding === "undefined") {
        return fs.readFileSync(filePath);
    } elseif (desiredEncoding === "binary" || desiredEncoding === "hex") {
        return fs.readFileSync(filePath, desiredEncoding);
    }

    const fileEncoding = GetFileEncodingHeader(filePath);
    let fileEncodingBytes = 0;
    let content = null;

    if (desiredEncoding === "ucs2") {
        desiredEncoding = "utf16le";
    } else if (desiredEncoding === "ascii") {
        desiredEncoding = "utf8";
    }

    if (fileEncoding === "utf16le" || fileEncoding === "utf16be") {
        fileEncodingBytes = 2;
        content = fs.readFileSync(filePath, "ucs2"); // utf-16 Little Endian

        if (desiredEncoding != fileEncoding &&
            !(fileEncoding == "utf16le" && (desiredEncoding === "utf8" || desiredEncoding === "default"))) {

            content = content.swap16();
        }
    } else {
        if (fileEncoding === "utf8") {
            fileEncodingBytes = 1;
        }

        content = fs.readFileSync(filePath, "utf8");
    }

    if (desiredEncoding === "default") {
        return content; // Per documentation, no encoding means return a raw buffer.
    }

    return content.toString(desiredEncoding, fileEncodingBytes);
}

function SetupDemoProcessorConfiguration() {
// TODO: Translate this to export functions above...
	const defaultSanitizeFile = {
	  transformTags: {
		'ol': sanitizeHtml.simpleTransform('ul', {class: 'foo'}),
	  }
	}
}

function GetDemoFiles() {
	const files = fs.readdirSync(ProjectDirectory);
	let demoFiles = [];

	for (let index = 0; index < files.length; index++) {
		const fileName = files[index];
		
		const filePath = path.join(ProjectDirectory, fileName);
		const fileAttributes = fs.lstatSync(filePath);

		const periodIndex = fileName.indexOf(".");
		if (fileAttributes.isDirectory() || !fileName.endsWith(".html") ||
			periodIndex == 0 || fileName.indexOf(".", periodIndex + 1) != -1)) {
			continue;
		}

		const demoFilePathWithoutExtension = path.join(ProjectDirectory, files[index].split(".")[0]);

		if (demoFiles.indexOf(demoFilePathWithoutExtension) == -1) {
			demoFiles.push(demoFilePathWithoutExtension);
		}
	}

	return demoFiles;
}

function BuildDemoDirectories(demoFiles) {
	let demoDirectories = [];

	for (let index = 0; index < demoFiles.length; index++) {
		const directory = path.normalize(path.join(demoFiles[index], "/"));

		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		}

		demoDirectories.push(directory);
	}

	return demoDirectories;
}

function ProcessLoadHtmlTag(tagName, attributes) {
	// load html file and return loaded file here...
}

function ProcessLoadCssTag(tagName, attributes) {
	// Record file and return as-is? Need the css files to build demo.css.
}

function ProcessLoadJavascriptTag(tagName, attributes) {
	// Record file and return as-is? Need the javascript files to build demo.javascript.
}

function BuildDemos() {
	const demoFiles = GetDemoFiles();
	const demoDirectories = BuildDemoDirectories(demoFiles);

	for (let index = 0; index < demoFiles.length; ++index) {
		const demoFile = demoFiles[index] + ".html";
		const loadedDemoFile = sanitizeHtml(ReadFileSync(demoFile, "utf8"),
	}
}

exports.printMsg = function() {
  console.log("This is a message from the demo package");
}