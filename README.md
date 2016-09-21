# WebGL
Javascript drawing in 3D 

deployed at: http://webgl-render.azurewebsites.net/

### Building
This project uses ant for building, with the "dev" target being the default:
 
    ant | ant dev | ant rel

### Build Dependencies
* gcc (for the C-preprocessor)
* uglifyjs (for Minification)
* jsdoc (for Documentation)

#### UglifyJS2
For ES6 compatibility, you have to use the "harmony" branch of UglifyJS2:

    git clone git://github.com/mishoo/UglifyJS2.git
    cd UglifyJS2
    git checkout harmony
    npm link .
    
## JSDoc
 JSDoc seems to support ES6:
 
    npm install -g jsdoc

### Building a scene
...
