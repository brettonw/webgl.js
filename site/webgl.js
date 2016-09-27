"use strict;";let context;let Render=function(){let _=Object.create(null);_.construct=function(canvasId){let canvas=this.canvas=document.getElementById(canvasId);context=this.context=canvas.getContext("webgl",{preserveDrawingBuffer:true});context.viewportWidth=canvas.width;context.viewportHeight=canvas.height;context.viewport(0,0,context.viewportWidth,context.viewportHeight);Shader.new("basic");Tetrahedron.make();Hexahedron.make();Octahedron.make();Icosahedron.make();Square.make();Sphere.makeN(2);Sphere.makeN(3);Sphere.makeN(5);return this};_.use=function(){context=this.context};_.new=function(canvasId){return render=Object.create(_).construct(canvasId)};return _}();let glMatrixArrayType=typeof Float32Array!="undefined"?Float32Array:typeof WebGLFloatArray!="undefined"?WebGLFloatArray:Array;let FloatN=function(dim){let _=Object.create(null);_.create=function(){return new glMatrixArrayType(dim)};eval(function(){let str="_.copy = function (from, to) { ";str+="to = (typeof to !== 'undefined') ? to : _.create (); ";for(let i=0;i<dim;++i){str+="to["+i+"] = from["+i+"]; "}str+="return to; ";str+="}; ";return str}());eval(function(){let str="_.point = function (from, to) {";str+="to = (typeof to !== 'undefined') ? to : _.create (); ";let end=dim-1;for(let i=0;i<end;++i){str+="to["+i+"] = from["+i+"]; "}str+="to["+end+"] = 1; ";str+="return to; ";str+="}; ";return str}());eval(function(){let str="_.vector = function (from, to) {";str+="to = (typeof to !== 'undefined') ? to : _.create (); ";let end=dim-1;for(let i=0;i<end;++i){str+="to["+i+"] = from["+i+"]; "}str+="to["+end+"] = 0; ";str+="return to; ";str+="}; ";return str}());eval(function(){let str="_.dot = function (left, right) {";str+="return (left[0] * right[0])";for(let i=1;i<dim;++i){str+=" + (left["+i+"] * right["+i+"])"}str+="; ";str+="}; ";return str}());_.normSq=function(from){return _.dot(from,from)};_.norm=function(from){return Math.sqrt(_.normSq(from))};eval(function(){let str="_.add = function (left, right, to) {";str+="to = (typeof to !== 'undefined') ? to : _.create (); ";for(let i=0;i<dim;++i){str+="to["+i+"] = left["+i+"] + right["+i+"]; "}str+="return to; ";str+="}; ";return str}());eval(function(){let str="_.subtract = function (left, right, to) {\n";str+="to = (typeof to !== 'undefined') ? to : _.create ();\n";for(let i=0;i<dim;++i){str+="to["+i+"] = left["+i+"] - right["+i+"]; "}str+="\n";str+="return to;\n";str+="};\n";return str}());eval(function(){let str="_.scale = function (from, scale, to) {";str+="to = (typeof to !== 'undefined') ? to : _.create (); ";for(let i=0;i<dim;++i){str+="to["+i+"] = from["+i+"] * scale; "}str+="return to; ";str+="}; ";return str}());eval(function(){let str="_.fixNum = function (from, precision, to) {";str+="to = (typeof to !== 'undefined') ? to : _.create (); ";for(let i=0;i<dim;++i){str+="to["+i+"] = Utility.fixNum (from["+i+"], precision); "}str+="return to; ";str+="}; ";return str}());_.normalize=function(from,to){return _.scale(from,1/_.norm(from),to)};eval(function(){let str="_.str = function (from) {";str+="return '(' + from[0]";for(let i=1;i<dim;++i){str+=" + ', ' +  + from["+i+"].toFixed (7)"}str+=" + ')'; ";str+="}; ";return str}());_.equals=function(left,right){return _.str(left)==_.str(right)};return _};let Float2=function(){let _=FloatN(2);_.perpendicular=function(from,to){to=typeof to!=="undefined"?to:_.create();to[0]=from[1];to[1]=-from[0];return to};return _}();let Float3=function(){let _=FloatN(3);_.cross=function(left,right,to){to=typeof to!=="undefined"?to:_.create();to[0]=left[1]*right[2]-left[2]*right[1];to[1]=left[2]*right[0]-left[0]*right[2];to[2]=left[0]*right[1]-left[1]*right[0];return to};return _}();let Float4=function(){let _=FloatN(4);return _}();let FloatNxN=function(dim){let _=Object.create(null);let _FloatN=FloatN(dim);let size=dim*dim;let index=_.index=function(row,column){return row*dim+column};let defineTo=function(to){to=typeof to!=="undefined"?to:"to";return to+" = (typeof "+to+" !== 'undefined') ? "+to+" : _.create ();\n"};_.create=function(){return new glMatrixArrayType(size)};eval(function(){let str="_.copy = function (from, to) {\n";str+=defineTo();for(let row=0;row<dim;++row){for(let col=0;col<dim;++col){let i=index(row,col);str+="to["+i+"] = from["+i+"]; "}str+="\n"}str+="return to;\n";str+="};\n";return str}());eval(function(){let str="_.identity = function (to) {\n";str+=defineTo();for(let row=0;row<dim;++row){for(let column=0;column<dim;++column){str+="to["+index(row,column)+"] = "+(row==column?1:0)+"; "}str+="\n"}str+="return to;\n";str+="};\n";return str}());eval(function(){let str="_.transpose = function (from, to) {\n";str+=defineTo();for(let row=0;row<dim;++row){for(let column=0;column<dim;++column){str+="to["+index(row,column)+"] = from["+index(column,row)+"]; "}str+="\n"}str+="return to;\n";str+="};\n";return str}());eval(function(){let rc=function(r,c){let str="(left["+index(r,0)+"] * right["+index(0,c)+"])";for(let i=1;i<dim;++i){str+=" + (left["+index(r,i)+"] * right["+index(i,c)+"])"}str+=";\n";return str};let str="_.multiply = function (left, right, to) {\n";str+=defineTo();for(let row=0;row<dim;++row){for(let column=0;column<dim;++column){str+="to["+index(row,column)+"] = "+rc(row,column)}}str+="return to;\n";str+="};\n";return str}());eval(function(){let end=dim-1;let str="_.scale = function (scale, to) {\n";str+="scale = Array.isArray(scale) ? scale : Array("+end+").fill(scale);\n";str+="to = _.identity (to);\n";for(let i=0;i<end;++i){str+="to["+index(i,i)+"] = scale["+i+"]; "}str+="\n";str+="return to;\n";str+="};\n";return str}());eval(function(){let end=dim-1;let str="_.translate = function (translate, to) {\n";str+="to = _.identity (to);\n";for(let i=0;i<end;++i){str+="to["+index(end,i)+"] = translate["+i+"]; "}str+="\n";str+="return to;\n";str+="};\n";return str}());eval(function(){let strRow=function(row){let str="'(' + from["+index(row,0)+"]";for(let column=1;column<dim;++column){str+=" + ', ' + from["+index(row,column)+"]"}str+=" + ')'";return str};let str="_.str = function (from) {\n";str+="return ";str+=strRow(0);for(let row=1;row<dim;++row){str+=" + ', ' + "+strRow(row)}str+=";\n";str+="};\n";return str}());return _};let Float4x4=function(){let dim=4;let _=FloatNxN(dim);_.inverse=function(from,to){to=typeof to!=="undefined"?to:_.create();let A=from[0]*from[5]-from[1]*from[4],B=from[0]*from[6]-from[2]*from[4],C=from[9]*from[14]-from[10]*from[13],D=from[9]*from[15]-from[11]*from[13],E=from[10]*from[15]-from[11]*from[14],F=from[0]*from[7]-from[3]*from[4],G=from[1]*from[6]-from[2]*from[5],H=from[1]*from[7]-from[3]*from[5],K=from[2]*from[7]-from[3]*from[6],L=from[8]*from[13]-from[9]*from[12],M=from[8]*from[14]-from[10]*from[12],N=from[8]*from[15]-from[11]*from[12],Q=1/(A*E-B*D+F*C+G*N-H*M+K*L);to[0]=(from[5]*E-from[6]*D+from[7]*C)*Q;to[1]=(-from[1]*E+from[2]*D-from[3]*C)*Q;to[2]=(from[13]*K-from[14]*H+from[15]*G)*Q;to[3]=(-from[9]*K+from[10]*H-from[11]*G)*Q;to[4]=(-from[4]*E+from[6]*N-from[7]*M)*Q;to[5]=(from[0]*E-from[2]*N+from[3]*M)*Q;to[6]=(-from[12]*K+from[14]*F-from[15]*B)*Q;to[7]=(from[8]*K-from[10]*F+from[11]*B)*Q;to[8]=(from[4]*D-from[5]*N+from[7]*L)*Q;to[9]=(-from[0]*D+from[1]*N-from[3]*L)*Q;to[10]=(from[12]*H-from[13]*F+from[15]*A)*Q;to[11]=(-from[8]*H+from[9]*F-from[11]*A)*Q;to[12]=(-from[4]*C+from[5]*M-from[6]*L)*Q;to[13]=(from[0]*C-from[1]*M+from[2]*L)*Q;to[14]=(-from[12]*G+from[13]*B-from[14]*A)*Q;to[15]=(from[8]*G-from[9]*B+from[10]*A)*Q;return to};_.multiplyVec4=function(a,b,c){c||(c=b);let d=b[0],e=b[1],g=b[2];b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};_.rotate=function(a,b,c,d){let e=c[0],g=c[1];c=c[2];let f=Math.sqrt(e*e+g*g+c*c);if(!f)return null;if(f!=1){f=1/f;e*=f;g*=f;c*=f}let h=Math.sin(b),i=Math.cos(b),j=1-i;b=a[0];f=a[1];let k=a[2],l=a[3],o=a[4],m=a[5],n=a[6],p=a[7],r=a[8],s=a[9],A=a[10],B=a[11],t=e*e*j+i,u=g*e*j+c*h,v=c*e*j-g*h,w=e*g*j-c*h,x=g*g*j+i,y=c*g*j+e*h,z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;if(d){if(a!=d){d[12]=a[12];d[13]=a[13];d[14]=a[14];d[15]=a[15]}}else d=a;d[0]=b*t+o*u+r*v;d[1]=f*t+m*u+s*v;d[2]=k*t+n*u+A*v;d[3]=l*t+p*u+B*v;d[4]=b*w+o*x+r*y;d[5]=f*w+m*x+s*y;d[6]=k*w+n*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+o*e+r*g;d[9]=f*z+m*e+s*g;d[10]=k*z+n*e+A*g;d[11]=l*z+p*e+B*g;return d};_.rotateX=function(a,b,c){let d=Math.sin(b);b=Math.cos(b);let e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[0]=a[0];c[1]=a[1];c[2]=a[2];c[3]=a[3];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};_.rotateY=function(a,b,c){let d=Math.sin(b);b=Math.cos(b);let e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[4]=a[4];c[5]=a[5];c[6]=a[6];c[7]=a[7];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};_.rotateZ=function(a,b,c){let d=Math.sin(b);b=Math.cos(b);let e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];if(c){if(a!=c){c[8]=a[8];c[9]=a[9];c[10]=a[10];c[11]=a[11];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};_.frustum=function(a,b,c,d,e,g,to){to=typeof to!=="undefined"?to:_.create();let h=b-a,i=d-c,j=g-e;to[0]=e*2/h;to[1]=0;to[2]=0;to[3]=0;to[4]=0;to[5]=e*2/i;to[6]=0;to[7]=0;to[8]=(b+a)/h;to[9]=(d+c)/i;to[10]=-(g+e)/j;to[11]=-1;to[12]=0;to[13]=0;to[14]=-(g*e*2)/j;to[15]=0;return to};_.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b=a*b;return _.frustum(-b,b,-a,a,c,d,e)};_.ortho=function(a,b,c,d,e,g,to){to=typeof to!=="undefined"?to:_.create();let h=b-a,i=d-c,j=g-e;to[0]=2/h;to[1]=0;to[2]=0;to[3]=0;to[4]=0;to[5]=2/i;to[6]=0;to[7]=0;to[8]=0;to[9]=0;to[10]=-2/j;to[11]=0;to[12]=-(a+b)/h;to[13]=-(d+c)/i;to[14]=-(g+e)/j;to[15]=1;return to};_.lookAt=function(a,b,c,to){to=typeof to!=="undefined"?to:_.create();let e=a[0],g=a[1];a=a[2];let f=c[0],h=c[1],i=c[2];c=b[1];let j=b[2];if(e==b[0]&&g==c&&a==j)return _.identity(to);let k,l,o,m;c=e-b[0];j=g-b[1];b=a-b[2];m=1/Math.sqrt(c*c+j*j+b*b);c*=m;j*=m;b*=m;k=h*b-i*j;i=i*c-f*b;f=f*j-h*c;if(m=Math.sqrt(k*k+i*i+f*f)){m=1/m;k*=m;i*=m;f*=m}else f=i=k=0;h=j*f-b*i;l=b*k-c*f;o=c*i-j*k;if(m=Math.sqrt(h*h+l*l+o*o)){m=1/m;h*=m;l*=m;o*=m}else o=l=h=0;to[0]=k;to[1]=h;to[2]=c;to[3]=0;to[4]=i;to[5]=l;to[6]=j;to[7]=0;to[8]=f;to[9]=o;to[10]=b;to[11]=0;to[12]=-(k*e+i*g+f*a);to[13]=-(h*e+l*g+o*a);to[14]=-(c*e+j*g+b*a);to[15]=1;return to};return _}();let Shader=function(){let _=Object.create(null);_.POSITION_ATTRIBUTE="POSITION_ATTRIBUTE";_.NORMAL_ATTRIBUTE="NORMAL_ATTRIBUTE";_.TEXTURE_ATTRIBUTE="TEXTURE_ATTRIBUTE";let shaders=Object.create(null);let currentShader;_.construct=function(name,vertexShaderUrl,fragmentShaderUrl,attributeMapping,parameterMapping){this.name=name;let fetchAndCompileShader=function(url,type){let compiledShader=null;let request=new XMLHttpRequest;request.open("GET",url,false);request.send(null);if(request.status===200){let tmpShader=context.createShader(type);context.shaderSource(tmpShader,request.responseText);context.compileShader(tmpShader);if(!context.getShaderParameter(tmpShader,context.COMPILE_STATUS)){}else{compiledShader=tmpShader}}return compiledShader};let vertexShader=fetchAndCompileShader(vertexShaderUrl,context.VERTEX_SHADER);let fragmentShader=fetchAndCompileShader(fragmentShaderUrl,context.FRAGMENT_SHADER);let program=this.program=context.createProgram();context.attachShader(program,vertexShader);context.attachShader(program,fragmentShader);context.linkProgram(program);if(!context.getProgramParameter(program,context.LINK_STATUS)){}context.useProgram(program);let reverseParameterMapping=Utility.reverseMap(parameterMapping);let standardParameterMapping=this.standardParameterMapping=Object.create(null);for(let i=0,end=context.getProgramParameter(program,context.ACTIVE_UNIFORMS);i<end;i++){let shaderParameter=ShaderParameter.new(program,i);let shaderParameterName=shaderParameter.name;let setShaderParameterFunctionName="set"+Utility.uppercase(shaderParameterName);this[setShaderParameterFunctionName]=function(value){shaderParameter.set(value);return this};if(shaderParameterName in reverseParameterMapping){standardParameterMapping[reverseParameterMapping[shaderParameterName]]=setShaderParameterFunctionName}}let reverseAttributeMapping=Utility.reverseMap(attributeMapping);let attributes=this.attributes=Object.create(null);for(let i=0,end=context.getProgramParameter(program,context.ACTIVE_ATTRIBUTES);i<end;i++){let activeAttribute=context.getActiveAttrib(program,i);let activeAttributeName=activeAttribute.name;if(activeAttributeName in reverseAttributeMapping){attributes[reverseAttributeMapping[activeAttributeName]]=ShaderAttribute.new(program,activeAttribute)}}return this};_.setStandardParameters=function(parameters){let standardParameterMapping=this.standardParameterMapping;for(let parameter in parameters){if(parameter in standardParameterMapping){this[standardParameterMapping[parameter]](parameters[parameter])}}};let bindAttribute=function(which,buffer){if(which in currentShader.attributes){context.bindBuffer(context.ARRAY_BUFFER,buffer);currentShader.attributes[which].bind()}return Shader};_.bindPositionAttribute=function(buffer){return bindAttribute(_.POSITION_ATTRIBUTE,buffer)};_.bindNormalAttribute=function(buffer){return bindAttribute(_.NORMAL_ATTRIBUTE,buffer)};_.bindTextureAttribute=function(buffer){return bindAttribute(_.TEXTURE_ATTRIBUTE,buffer)};_.getCurrentShader=function(){return currentShader};_.use=function(){if(currentShader!==this){currentShader=this;context.useProgram(this.program)}return this};_.getName=function(){return this.name};_.new=function(name,vertexShaderUrl,fragmentShaderUrl,attributeMapping,parameterMapping){vertexShaderUrl=typeof vertexShaderUrl!=="undefined"?vertexShaderUrl:"http://webgl-render.azurewebsites.net/site/shaders/vertex-basic.glsl";fragmentShaderUrl=typeof fragmentShaderUrl!=="undefined"?fragmentShaderUrl:"http://webgl-render.azurewebsites.net/site/shaders/fragment-basic.glsl";attributeMapping=Utility.defaultFunction(attributeMapping,function(){return{POSITION_ATTRIBUTE:"inputPosition",NORMAL_ATTRIBUTE:"inputNormal",TEXTURE_ATTRIBUTE:"inputTexture"}});parameterMapping=Utility.defaultFunction(parameterMapping,function(){return{MODEL_MATRIX_PARAMETER:"modelMatrix",VIEW_MATRIX_PARAMETER:"viewMatrix",PROJECTION_MATRIX_PARAMETER:"projectionMatrix",NORMAL_MATRIX_PARAMETER:"normalMatrix",OUTPUT_ALPHA_PARAMETER:"outputAlpha"}});return shaders[name]=Object.create(_).construct(name,vertexShaderUrl,fragmentShaderUrl,attributeMapping,parameterMapping)};_.get=function(name){return shaders[name]};return _}();let ShaderParameter=function(){let _=Object.create(null);_.construct=function(program,i){let activeUniform=context.getActiveUniform(program,i);this.name=activeUniform.name;this.type=activeUniform.type;this.location=context.getUniformLocation(program,activeUniform.name);this.lastValue="XXXXX";return this};_.set=function(value){if(value!==this.lastValue){switch(this.type){case 5124:context.uniform1i(this.location,value);break;case 35667:context.uniform2iv(this.location,value);break;case 35668:context.uniform3iv(this.location,value);break;case 35669:context.uniform4iv(this.location,value);break;case 5126:context.uniform1f(this.location,value);break;case 35664:context.uniform2fv(this.location,value);break;case 35665:context.uniform3fv(this.location,value);break;case 35666:context.uniform4fv(this.location,value);break;case 35674:context.uniformMatrix2fv(this.location,false,value);break;case 35675:context.uniformMatrix3fv(this.location,false,value);break;case 35676:context.uniformMatrix4fv(this.location,false,value);break}this.lastValue=value}};_.new=function(program,i){return Object.create(_).construct(program,i)};return _}();let ShaderAttribute=function(){let _=Object.create(null);_.construct=function(program,activeAttribute){this.name=activeAttribute.name;this.type=activeAttribute.type;this.location=context.getAttribLocation(program,this.name);context.enableVertexAttribArray(this.location);switch(this.type){case 5124:this.bind=function(){context.vertexAttribPointer(this.location,1,context.INT,false,0,0)};break;case 35667:this.bind=function(){context.vertexAttribPointer(this.location,2,context.INT,false,0,0)};break;case 35668:this.bind=function(){context.vertexAttribPointer(this.location,3,context.INT,false,0,0)};break;case 35669:this.bind=function(){context.vertexAttribPointer(this.location,4,context.INT,false,0,0)};break;case 5126:this.bind=function(){context.vertexAttribPointer(this.location,1,context.FLOAT,false,0,0)};break;case 35664:this.bind=function(){context.vertexAttribPointer(this.location,2,context.FLOAT,false,0,0)};break;case 35665:this.bind=function(){context.vertexAttribPointer(this.location,3,context.FLOAT,false,0,0)};break;case 35666:this.bind=function(){context.vertexAttribPointer(this.location,4,context.FLOAT,false,0,0)};break}return this};_.new=function(program,activeAttribute){return Object.create(_).construct(program,activeAttribute)};return _}();let Node=function(){let _=Object.create(null);let nodes=Object.create(null);_.construct=function(parameters){let HAS_TRANSFORM=1;let HAS_STATE=2;let HAS_SHAPE=4;let HAS_CHILDREN=8;let traverseFunctionIndex=0;if(typeof parameters!=="undefined"){if("name"in parameters){this.name=parameters.name;nodes[this.name]=this}if("transform"in parameters){this.transform=parameters.transform;traverseFunctionIndex+=HAS_TRANSFORM}if("state"in parameters){this.state=parameters.state;traverseFunctionIndex+=HAS_STATE}if("shape"in parameters){this.shape=Shape.get(parameters.shape);traverseFunctionIndex+=HAS_SHAPE}if(!("children"in parameters)||parameters.children!=false){this.children=[];traverseFunctionIndex+=HAS_CHILDREN}}else{this.children=[];traverseFunctionIndex+=HAS_CHILDREN}let INVALID_TRAVERSE=function(transform){return this};this.traverse=[INVALID_TRAVERSE,INVALID_TRAVERSE,INVALID_TRAVERSE,INVALID_TRAVERSE,function(standardParameters){Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();return this},function(standardParameters){standardParameters.MODEL_MATRIX_PARAMETER=Float4x4.multiply(this.transform,standardParameters.MODEL_MATRIX_PARAMETER);standardParameters.NORMAL_MATRIX_PARAMETER=Float4x4.transpose(Float4x4.inverse(standardParameters.MODEL_MATRIX_PARAMETER));Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();return this},function(standardParameters){this.state(standardParameters);standardParameters.NORMAL_MATRIX_PARAMETER=Float4x4.transpose(Float4x4.inverse(standardParameters.MODEL_MATRIX_PARAMETER));Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();return this},function(standardParameters){this.state(standardParameters);standardParameters.MODEL_MATRIX_PARAMETER=Float4x4.multiply(this.transform,standardParameters.MODEL_MATRIX_PARAMETER);standardParameters.NORMAL_MATRIX_PARAMETER=Float4x4.transpose(Float4x4.inverse(standardParameters.MODEL_MATRIX_PARAMETER));Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();return this},function(standardParameters){let modelMatrix=standardParameters.MODEL_MATRIX_PARAMETER;for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this},function(standardParameters){let modelMatrix=Float4x4.multiply(this.transform,standardParameters.MODEL_MATRIX_PARAMETER);for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this},function(standardParameters){this.state(standardParameters);let modelMatrix=standardParameters.MODEL_MATRIX_PARAMETER;for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this},function(standardParameters){this.state(standardParameters);let modelMatrix=Float4x4.multiply(this.transform,standardParameters.MODEL_MATRIX_PARAMETER);for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this},function(standardParameters){let modelMatrix=standardParameters.MODEL_MATRIX_PARAMETER;standardParameters.NORMAL_MATRIX_PARAMETER=Float4x4.transpose(Float4x4.inverse(standardParameters.MODEL_MATRIX_PARAMETER));Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this},function(standardParameters){let modelMatrix=standardParameters.MODEL_MATRIX_PARAMETER=Float4x4.multiply(this.transform,standardParameters.MODEL_MATRIX_PARAMETER);standardParameters.NORMAL_MATRIX_PARAMETER=Float4x4.transpose(Float4x4.inverse(standardParameters.MODEL_MATRIX_PARAMETER));Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this},function(standardParameters){this.state(standardParameters);let modelMatrix=standardParameters.MODEL_MATRIX_PARAMETER;standardParameters.NORMAL_MATRIX_PARAMETER=Float4x4.transpose(Float4x4.inverse(standardParameters.MODEL_MATRIX_PARAMETER));Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this},function(standardParameters){this.state(standardParameters);let modelMatrix=standardParameters.MODEL_MATRIX_PARAMETER=Float4x4.multiply(this.transform,standardParameters.MODEL_MATRIX_PARAMETER);standardParameters.NORMAL_MATRIX_PARAMETER=Float4x4.transpose(Float4x4.inverse(standardParameters.MODEL_MATRIX_PARAMETER));Shader.getCurrentShader().setStandardParameters(standardParameters);this.shape.draw();for(let child of this.children){standardParameters.MODEL_MATRIX_PARAMETER=modelMatrix;child.traverse(standardParameters)}return this}][traverseFunctionIndex];return this};_.addChild=function(node){if("children"in this){this.children.push(node)}else{}return this};_.traverse=function(standardParameters){return this};_.getName=function(){return"name"in this?this.name:"node"};_.get=function(name){return nodes[name]};_.new=function(parameters){return Object.create(_).construct(parameters)};return _}();let Cloud=function(){let _=Object.create(Node);_.construct=function(parameters){Object.getPrototypeOf(_).construct.call(this,parameters);this.pointShape="pointShape"in parameters?parameters.pointShape:"sphere2";this.pointSize="pointSize"in parameters?parameters.pointSize:.02;return this};_.addPoint=function(point){let transform=Float4x4.multiply(Float4x4.scale(this.pointSize),Float4x4.translate(point));this.addChild(Node.new({transform:transform,shape:this.pointShape,children:false}));return this};_.addPoints=function(points){for(let point of points){this.addPoint(point)}};_.new=function(parameters){parameters.children=true;return Object.create(_).construct(parameters)};return _}();let Shape=function(){let _=Object.create(null);let shapes=Object.create(null);let currentShape;_.construct=function(name,buffers){this.name=name;let makeBuffer=function(bufferType,source,itemSize){let buffer=context.createBuffer();context.bindBuffer(bufferType,buffer);context.bufferData(bufferType,source,context.STATIC_DRAW);buffer.itemSize=itemSize;buffer.numItems=source.length/itemSize;return buffer};let HAS_NORMAL=1;let HAS_TEXTURE=2;let HAS_INDEX=4;let drawFunctionIndex=0;if("position"in buffers){this.positionBuffer=makeBuffer(context.ARRAY_BUFFER,new Float32Array(buffers.position),3)}else{}if("normal"in buffers){this.normalBuffer=makeBuffer(context.ARRAY_BUFFER,new Float32Array(buffers.normal),3);drawFunctionIndex+=HAS_NORMAL}if("texture"in buffers){this.normalBuffer=makeBuffer(context.ARRAY_BUFFER,new Float32Array(buffers.texture),2);drawFunctionIndex+=HAS_TEXTURE}if("index"in buffers){this.indexBuffer=makeBuffer(context.ELEMENT_ARRAY_BUFFER,new Uint16Array(buffers.index),1);drawFunctionIndex+=HAS_INDEX}this.draw=[function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer)}context.drawArrays(context.TRIANGLES,0,this.positionBuffer.numItems)},function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer).bindNormalAttribute(this.normalBuffer)}context.drawArrays(context.TRIANGLES,0,this.positionBuffer.numItems)},function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer).bindTextureAttribute(this.textureBuffer)}context.drawArrays(context.TRIANGLES,0,this.positionBuffer.numItems)},function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer).bindNormalAttribute(this.normalBuffer).bindTextureAttribute(this.textureBuffer)}context.drawArrays(context.TRIANGLES,0,this.positionBuffer.numItems)},function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer);context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}context.drawElements(context.TRIANGLES,this.indexBuffer.numItems,context.UNSIGNED_SHORT,0)},function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer).bindNormalAttribute(this.normalBuffer);context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}context.drawElements(context.TRIANGLES,this.indexBuffer.numItems,context.UNSIGNED_SHORT,0)},function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer).bindTextureAttribute(this.textureBuffer);context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}context.drawElements(context.TRIANGLES,this.indexBuffer.numItems,context.UNSIGNED_SHORT,0)},function(){if(this.setCurrentShape()){Shader.bindPositionAttribute(this.positionBuffer).bindNormalAttribute(this.normalBuffer).bindTextureAttribute(this.textureBuffer);context.bindBuffer(context.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}context.drawElements(context.TRIANGLES,this.indexBuffer.numItems,context.UNSIGNED_SHORT,0)}][drawFunctionIndex];return this};_.setCurrentShape=function(){if(currentShape!==this){currentShape=this;return true}return false};_.new=function(name,buffers){return shapes[name]=Object.create(_).construct(name,buffers())};_.get=function(name){return shapes[name]};return _}();let ShapeBuilder=function(){let _=Object.create(null);_.construct=function(precision){this.precision=typeof precision!=="undefined"?precision:7;this.vertexIndex=Object.create(null);this.vertices=[];this.faces=[];this.normals=[];return this};_.addVertex=function(vertex){let str=Float3.str(vertex);if(str in this.vertexIndex){return this.vertexIndex[str]}else{let index=this.vertices.length;this.vertices.push(vertex);this.vertexIndex[str]=index;return index}};_.addVertexNormal=function(vertex,normal){let str=Float3.str(vertex)+Float3.str(normal);if(str in this.vertexIndex){return this.vertexIndex[str]}else{let index=this.vertices.length;this.vertices.push(vertex);this.normals.push(normal);this.vertexIndex[str]=index;return index}};_.addFace=function(face){this.faces.push(face)};_.makeBuffers=function(){let result={position:Utility.flatten(this.vertices),index:Utility.flatten(this.faces)};if(this.normals.length>0){result.normal=Utility.flatten(this.normals)}return result};_.makeFacets=function(){let vertex=[];let normal=[];for(let face of this.faces){let a=this.vertices[face[0]];let b=this.vertices[face[1]];let c=this.vertices[face[2]];let ab=Float3.normalize(Float3.subtract(b,a));let bc=Float3.normalize(Float3.subtract(c,b));let n=Float3.cross(ab,bc);for(let i=0;i<face.length;++i){vertex.push(this.vertices[face[i]]);normal.push(n)}}return{position:Utility.flatten(vertex),normal:Utility.flatten(normal)}};_.new=function(precision){return Object.create(ShapeBuilder).construct(precision)};return _}();let Primitive=function(){let _=Object.create(null);_.getShapeBuilder=function(){};_.makeFromBuilder=function(name,builder){name=typeof name!=="undefined"?name:this.name;return Shape.new(name,function(){return builder.makeFacets()})};_.make=function(name){let builder=this.getShapeBuilder();return this.makeFromBuilder(name,builder)};return _}();let Tetrahedron=function(){let _=Object.create(Primitive);_.name="tetrahedron";_.getShapeBuilder=function(){let builder=ShapeBuilder.new();builder.addVertex([1,1,1]);builder.addVertex([-1,1,-1]);builder.addVertex([-1,-1,1]);builder.addVertex([1,-1,-1]);builder.addFace([0,1,2]);builder.addFace([1,3,2]);builder.addFace([2,3,0]);builder.addFace([3,1,0]);return builder};return _}();let Hexahedron=function(){let _=Object.create(Primitive);_.name="cube";_.getShapeBuilder=function(){let builder=ShapeBuilder.new();builder.addVertex([-1,-1,-1]);builder.addVertex([-1,1,-1]);builder.addVertex([1,1,-1]);builder.addVertex([1,-1,-1]);builder.addVertex([-1,-1,1]);builder.addVertex([-1,1,1]);builder.addVertex([1,1,1]);builder.addVertex([1,-1,1]);builder.addFace([0,1,2,0,2,3]);builder.addFace([7,6,5,7,5,4]);builder.addFace([1,5,6,1,6,2]);builder.addFace([4,0,3,4,3,7]);builder.addFace([4,5,1,4,1,0]);builder.addFace([3,2,6,3,6,7]);return builder};return _}();let Octahedron=function(){let _=Object.create(Primitive);_.name="octahedron";_.getShapeBuilder=function(){let builder=ShapeBuilder.new();builder.addVertex([0,1,0]);builder.addVertex([1,0,0]);builder.addVertex([0,0,1]);builder.addVertex([-1,0,0]);builder.addVertex([0,0,-1]);builder.addVertex([0,-1,0]);builder.addFace([0,2,1]);builder.addFace([0,3,2]);builder.addFace([0,4,3]);builder.addFace([0,1,4]);builder.addFace([5,1,2]);builder.addFace([5,2,3]);builder.addFace([5,3,4]);builder.addFace([5,4,1]);return builder};return _}();let Icosahedron=function(){let _=Object.create(Primitive);_.name="icosahedron";_.getShapeBuilder=function(){let builder=ShapeBuilder.new();let t=(1+Math.sqrt(5))/2;let s=1/t;t=1;builder.addVertex([-s,t,0]);builder.addVertex([s,t,0]);builder.addVertex([-s,-t,0]);builder.addVertex([s,-t,0]);builder.addVertex([0,-s,t]);builder.addVertex([0,s,t]);builder.addVertex([0,-s,-t]);builder.addVertex([0,s,-t]);builder.addVertex([t,0,-s]);builder.addVertex([t,0,s]);builder.addVertex([-t,0,-s]);builder.addVertex([-t,0,s]);builder.addFace([0,11,5]);builder.addFace([0,5,1]);builder.addFace([0,1,7]);builder.addFace([0,7,10]);builder.addFace([0,10,11]);builder.addFace([1,5,9]);builder.addFace([5,11,4]);builder.addFace([11,10,2]);builder.addFace([10,7,6]);builder.addFace([7,1,8]);builder.addFace([3,9,4]);builder.addFace([3,4,2]);builder.addFace([3,2,6]);builder.addFace([3,6,8]);builder.addFace([3,8,9]);builder.addFace([4,9,5]);builder.addFace([2,4,11]);builder.addFace([6,2,10]);builder.addFace([8,6,7]);builder.addFace([9,8,1]);return builder};return _}();let Square=function(){let _=Object.create(Primitive);_.name="square";_.getShapeBuilder=function(){let builder=ShapeBuilder.new();builder.addVertex([-1,-1,0]);builder.addVertex([-1,1,0]);builder.addVertex([1,1,0]);builder.addVertex([1,-1,0]);builder.addFace([2,1,3,1,0,3]);return builder};return _}();let Sphere=function(){let _=Object.create(Primitive);_.name="sphere";_.parameters={baseShapeBuilderType:Icosahedron,subdivisions:4};_.getShapeBuilder=function(){let builder=ShapeBuilder.new();let addVertex=function(vertex){return builder.addVertex(Float3.normalize(vertex))};let baseShapeBuilder=this.parameters.baseShapeBuilderType.getShapeBuilder();for(let vertex of baseShapeBuilder.vertices){addVertex(vertex)}let vertices=builder.vertices;let faces=builder.faces=baseShapeBuilder.faces;let subdivide=function(){let tri=faces.splice(0,1)[0];let v0=addVertex(Float3.add(vertices[tri[0]],vertices[tri[1]]));let v1=addVertex(Float3.add(vertices[tri[1]],vertices[tri[2]]));
let v2=addVertex(Float3.add(vertices[tri[2]],vertices[tri[0]]));builder.addFace([tri[0],v0,v2]);builder.addFace([tri[1],v1,v0]);builder.addFace([tri[2],v2,v1]);builder.addFace([v0,v1,v2])};for(let j=0;j<this.parameters.subdivisions;++j){for(let i=0,faceCount=faces.length;i<faceCount;++i){subdivide()}}return builder};_.makeFromBuilder=function(name,builder){name=typeof name!=="undefined"?name:this.name;return Shape.new(name,function(){let buffers=builder.makeBuffers();buffers.normal=buffers.position;return buffers})};_.makeN=function(n){this.parameters.subdivisions=n;this.make(this.name+n)};return _}();let makeRevolve=function(name,outline,steps){return Shape.new(name,function(){let N=[];let pushNormal=function(a,c){let ac=Float2.subtract(a,c);let acPerp=Float2.perpendicular(ac);N.push(Float2.normalize(acPerp))};let length=outline.length-1;if(Float2.equals(outline[0],outline[outline.length-1])){for(b=0;b<length;++b){let a=outline[(b-1+length)%length];let c=outline[(b+1)%length];pushNormal(a,c)}}else{for(b=0;b<=length;++b){let a=outline[b==0?b:b-1];let c=outline[b==length?b:b+1];pushNormal(a,c)}}let builder=ShapeBuilder.new();let stepAngle=2*Math.PI/steps;for(let i=0;i<steps;++i){let j=(i+1)%steps;let iAngle=i*stepAngle,iCosAngle=Math.cos(iAngle),iSinAngle=Math.sin(iAngle);let jAngle=j*stepAngle,jCosAngle=Math.cos(jAngle),jSinAngle=Math.sin(jAngle);for(let m=0,end=outline.length-1;m<end;++m){let n=m+1;let vm=outline[m],nm=N[m];let vn=outline[n],nn=N[n];if(!(vm[0]==0&&vn[0]==0)){let vm0=builder.addVertexNormal([vm[0]*iCosAngle,vm[1],vm[0]*iSinAngle],[nm[0]*iCosAngle,nm[1],nm[0]*iSinAngle]);let vn0=builder.addVertexNormal([vn[0]*iCosAngle,vn[1],vn[0]*iSinAngle],[nn[0]*iCosAngle,nn[1],nn[0]*iSinAngle]);if(vm[0]==0){let vn1=builder.addVertexNormal([vn[0]*jCosAngle,vn[1],vn[0]*jSinAngle],[nn[0]*jCosAngle,nn[1],nn[0]*jSinAngle]);builder.addFace([vm0,vn1,vn0])}else if(vn[0]==0){let vm1=builder.addVertexNormal([vm[0]*jCosAngle,vm[1],vm[0]*jSinAngle],[nm[0]*jCosAngle,nm[1],nm[0]*jSinAngle]);builder.addFace([vn0,vm0,vm1])}else{let vm1=builder.addVertexNormal([vm[0]*jCosAngle,vm[1],vm[0]*jSinAngle],[nm[0]*jCosAngle,nm[1],nm[0]*jSinAngle]);let vn1=builder.addVertexNormal([vn[0]*jCosAngle,vn[1],vn[0]*jSinAngle],[nn[0]*jCosAngle,nn[1],nn[0]*jSinAngle]);builder.addFace([vm0,vn1,vn0]);builder.addFace([vn1,vm0,vm1])}}}}return builder.makeBuffers()})};let makeBall=function(name,steps){let outline=[];let stepAngle=Math.PI/steps;for(let i=0;i<=steps;++i){let angle=stepAngle*i;outline.push(Float2.fixNum([Math.sin(angle),Math.cos(angle)]))}return makeRevolve(name,outline,steps*2)};let Utility=function(){let _=Object.create(null);_.degreesToRadians=function(degrees){return degrees/180*Math.PI};_.radiansToDegrees=function(radians){return radians/Math.PI*180};_.uppercase=function(string){return string[0].toUpperCase()+string.slice(1)};_.lowercase=function(string){return string[0].toLowerCase()+string.slice(1)};_.flatten=function(array){let result=[];for(let element of array){for(let value of element){result.push(value)}}return result};_.fixNum=function(number,precision){let fix=typeof precision!=="undefined"?precision:7;return Number.parseFloat(number.toFixed(fix))};_.defaultValue=function(value,defaultValue){return typeof value!=="undefined"?value:defaultValue};_.defaultFunction=function(value,defaultFunction){return typeof value!=="undefined"?value:defaultFunction()};_.reverseMap=function(mapping){let reverseMapping=Object.create(null);for(let name in mapping){reverseMapping[mapping[name]]=name}return reverseMapping};return _}();