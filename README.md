# webgl.js
Javascript drawing in 3D 

Deployed at: https://brettonw.github.io/webgl.js/ or http://webgl-js.azurewebsites.net/.

<img style="width:640px; margin: 0 auto;" src="/src/main/img/sample.png" alt="Drawing"/>

### Building
This project uses ant for building, with the "dev" target being the default:
 
    ant | ant dev | ant rel

### Build Dependencies
* ant
* node/npm
* gcc (for the C-preprocessor)
* uglify-js (for Minification)
* yuidoc (for Documentation)

### UglifyJS

    npm install --location=global uglify-js

### YUIDoc
YUIDoc only reads the comments, so it doesn't impose any code structure:
 
    npm install --location=global yuidocjs
    
It would be better if I could point it at a single file. Syntax reference at 
http://yui.github.io/yuidoc/
.

The theme is "lucid", from https://www.npmjs.com/package/yuidoc-lucid-theme

    npm install --location=global yuidoc-lucid-theme
    
### Building a scene
...
