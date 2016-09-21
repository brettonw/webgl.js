# WebGL
Javascript drawing in 3D 

deployed at: http://webgl-render.azurewebsites.net/

### Building
This project uses ant for building. It requires gcc for the C-preprocessor.
 
    ant dev
    ant release

### UglifyJS Minification
I had a difficult time finding a minifier, after abandoning YUI, primarily because I'm dabbling with 
ES6 features here and older minifiers don't understand that. So...

    git clone git://github.com/mishoo/UglifyJS2.git
    cd UglifyJS2
    git checkout harmony
    npm link .
    
## Building Documentation
Using JSDoc:
 
    npm install -g jsdoc

### Building a scene
...
