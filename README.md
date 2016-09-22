# WebGL
Javascript drawing in 3D 

deployed at: http://webgl-render.azurewebsites.net/

### Building
This project uses ant for building, with the "dev" target being the default:
 
    ant | ant dev | ant rel

### Build Dependencies
* gcc (for the C-preprocessor)
* uglifyjs (for Minification)
* yuidoc (for Documentation)

#### UglifyJS2
For ES6 compatibility, you have to use the "harmony" branch of UglifyJS2:

    git clone git://github.com/mishoo/UglifyJS2.git
    cd UglifyJS2
    git checkout harmony
    npm link .
    
## YUIDoc
YUIDoc only reads the comments, so it doesn't impose any code structure:
 
    npm install -g yuidoc
    
It would be better if I could point it at a single file. Syntax reference at 
http://yui.github.io/yuidoc/
.
    
I also tried:
* JSDoc, which wanted very specific code structure, and wouldn't bend to my will, and
* ESDoc, which crashed on my code.

### Building a scene
...
