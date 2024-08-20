
import fs from 'fs'
import {
	fileURLToPath
} from 'url';
import {
	dirname
} from 'path';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiler = async()=>{
  console.log("executing compiler")
let routes = []
function readDirAsync(directoryPath) {
	return new Promise((resolve, reject) => {
		fs.readdir(directoryPath, (err, files) => {
			if (err) {
				reject(err);
			} else {
				// console.log(files)
				resolve(files);
			}
		});
	});
}

function appendRouterWithNavigate_WithScript(fileName) {
      const toWriteRouter = `
const ${fileName}Data =sessionStorage.getItem("${fileName}");
function ${fileName}()
      {
          onNavigate("/${fileName}");
          // let myScript = document.createElement("script");
          // myScript.setAttribute("src", "../Logic/${fileName}.js");
          // myScript.setAttribute("type", "module");
          // removeScriptBySrc("Logic")
          // document.body.appendChild(myScript);
          window.location.reload()
      };
      
      `
      fs.appendFileSync(routerFilePath, toWriteRouter, (err, contents) => {
      if (err) throw err;
        // console.log(`Content of ${file}: ${contents}`);
	});
}

function appendRouterWithNavigate_WithoutScript(fileName) {
      const toWriteRouter = `const ${fileName}Data =sessionStorage.getItem("${fileName}");
            function ${fileName}(){
                onNavigate("/${fileName}");
            };`
      fs.appendFileSync(routerFilePath, toWriteRouter, (err, contents) => {
        if (err) throw err;
        // console.log(`Content of ${file}: ${contents}`);
      });
}
async function blockingFileNamesRead(files){
  let fileNames = []
  files.forEach((file) => {
	//removes .js from the string
  // console.log(file)
	const str = file.slice(0,-3)
  // console.log(str)
	fileNames.push(str)
})
  return fileNames;
}
const logicFiles = await readDirAsync(path.join(__dirname, "../Logic"))
const logicFileNames = await blockingFileNamesRead(logicFiles)
logicFileNames.push("")
const pagesFiles = await readDirAsync(path.join(__dirname, "../Pages"))
let pageFileNames = await blockingFileNamesRead(pagesFiles)




const loaderFilePath = path.join(__dirname, 'loader.js')
const routerFilePath = path.join(__dirname, 'router.js')


const defaultPage = 'Home';
const defaultPageData = `const dom = document.getElementById("virtual-dom");
dom.innerHTML = ${defaultPage};`;
fs.writeFileSync(loaderFilePath, defaultPageData, (err) => {
	if (err) throw err
})


const routesLogicData = `const dom = document.getElementById('virtual-dom');

//don't touch this function            
function onNavigate(pathname){
  console.log(pathname)
  dom.innerHTML = routes[pathname];
  window.history.pushState(
      {},
      '',
      window.location.origin+pathname
  )
  // window.location.pathname = pathname
  
}

function removeScriptBySrc(src) {
  console.log("in remove script : ")
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
      // console.log(scripts[i].src)
      if (scripts[i].src.includes(src)) {
          scripts[i].parentNode.removeChild(scripts[i]);

      }
  }
}
`;
fs.writeFileSync(routerFilePath, routesLogicData, (err) => {
	if (err) throw err
})

routes.push(`/`)
let routesObj = `
var routes = {"":${defaultPage}Data`

pageFileNames.forEach(file => {

	//----------------loader file-------------------//
	const toWriteLoader = `import ${file} from "../Pages/${file}.js";
      window.sessionStorage.setItem("${file}",${file});`
	fs.appendFileSync(loaderFilePath, toWriteLoader, (err, contents) => {
		if (err) throw err;
		// console.log(`Content of ${file}: ${contents}`);
	});

	//--------------router file--------------------//
	if (logicFileNames.includes(file)) {
		appendRouterWithNavigate_WithScript(file);
	} else {
		appendRouterWithNavigate_WithoutScript(file);
	}
	routesObj = routesObj + `,"/${file.toLowerCase()}":${file}Data,"/${file}":${file}Data`
  routes.push(`/${file.toLowerCase()}`)
});

routesObj = routesObj + `};
if(window.location.pathname in routes == true)
    {
        dom.innerHTML = routes[window.location.pathname];
        // console.log("in routing")
    }

var logicRoutes =${JSON.stringify(logicFileNames)};

//executes only once for the cases when the user visits the specific route from search
if(logicRoutes.includes(window.location.pathname.slice(1)))
    {
        let myScript = document.createElement("script");
        const filename = window.location.pathname.slice(1)
        let filepath = "../Logic/" + filename + ".js"
        if(filename==""){
            filepath = "../Logic/Home.js"
        }
        myScript.setAttribute("src", filepath);
        myScript.setAttribute("type", "module");
        document.body.appendChild(myScript);
    }
function loadScriptBasedOnRoute() {
            const pathname = window.location.pathname.slice(1); // Remove leading slash
    
            if (logicRoutes.includes(pathname)) {
                let myScript = document.createElement("script");
                const filename = pathname;
                onNavigate("/"+filename)
                const filepath = "../Logic/" + filename + ".js";
                myScript.setAttribute("src", filepath);
                myScript.setAttribute("type", "module");
                document.body.appendChild(myScript);
                // console.log("executed")
            }
            // console.log("in the checking part")
        }  
window.addEventListener('popstate', loadScriptBasedOnRoute);
        
    
    `
fs.appendFileSync(routerFilePath, routesObj, (err, contents) => {
	if (err) throw err;
});
return routes;
}

export default compiler;

