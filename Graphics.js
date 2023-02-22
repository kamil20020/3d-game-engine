class Color{
    static rgb(color){

        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    }
}

class Vec3d{
    constructor(x=0, y=0, z=0, w=1){
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        this.normal
    }

    static mul(vec1, vec2){

        let newVec = new Vec3d()

        if(vec2 instanceof Vec3d){
            
            newVec.x = vec1.x * vec2.x
            newVec.y = vec1.y * vec2.y
            newVec.z = vec1.z * vec2.z
        }
        else{

            newVec.x = vec1.x * vec2
            newVec.y = vec1.y * vec2
            newVec.z = vec1.z * vec2
        }

        return newVec
    }

    static add(vec1, vec2){

        let newVec = new Vec3d()

        newVec.x = vec1.x + vec2.x
        newVec.y = vec1.y + vec2.y
        newVec.z = vec1.z + vec2.z

        return newVec
    }

    static sub(vec1, vec2){

        let newVec = new Vec3d()

        newVec.x = vec1.x - vec2.x
        newVec.y = vec1.y - vec2.y
        newVec.z = vec1.z - vec2.z

        return newVec
    }

    static crossProduct(vec1, vec2){

        let newVec = new Vec3d()

        newVec.x = vec1.y * vec2.z - vec1.z * vec2.y, 
        newVec.y = vec1.z * vec2.x - vec1.x * vec2.z, 
        newVec.z = vec1.x * vec2.y - vec1.y * vec2.x

        return newVec
    }

    static dotProduct(vec1, vec2){

        let result = 0

        result = vec1.x * vec2.x + 
                 vec1.y * vec2.y + 
                 vec1.z * vec2.z

        return result
    }

    static normalize(vec){

        let newVec = new Vec3d()

        const sum = vec.x * vec.x + vec.y * vec.y + vec.z * vec.z

        if(sum == 0){
            return vec
        }

        let vecLength = Math.sqrt(sum)

        newVec.x = vec.x / vecLength
        newVec.y = vec.y / vecLength
        newVec.z = vec.z / vecLength

        return newVec
    }

    print(){

        console.table([this.x, this.y, this.z])
    }
}

class Triangle{
    constructor(v1, v2, v3, color=[255, 0, 0]){
        this.v1 = v1
        this.v2 = v2
        this.v3 = v3
        this.color = color
        this.normal = 0
    }

    arr(){
        return [this.v1, this.v2, this.v3]
    }

    fillGradient(context, color=this.color){

        const radius = 180

        const v1R = color[0] * this.v1.normal.x
        const v1G = color[1] * this.v1.normal.y
        const v1B = color[2] * this.v1.normal.z
        const v1RGB = Color.rgb(v1R, v1G, v1B)

        const v2R = color[0] * this.v2.normal.x
        const v2G = color[1] * this.v2.normal.y
        const v2B = color[2] * this.v2.normal.z
        const v2RGB = Color.rgb(v2R, v2G, v2B)

        const v3R = color[0] * this.v3.normal.x
        const v3G = color[1] * this.v3.normal.y
        const v3B = color[2] * this.v3.normal.z
        const v3RGB = Color.rgb(v3R, v3G, v3B)

        const oldRGB = Color.rgb([...color])

        const grd1 = context.createRadialGradient(this.v1.x, this.v1.y, 0, this.v1.x, this.v1.y, radius);
        grd1.addColorStop(0, v1RGB);
        grd1.addColorStop(1, oldRGB);

        const grd2 = context.createRadialGradient(this.v2.x, this.v2.y, 0, this.v2.x, this.v2.y, radius);
        grd2.addColorStop(0, v2RGB);
        grd2.addColorStop(1, oldRGB);

        const grd3 = context.createRadialGradient(this.v3.x, this.v3.y, 0, this.v3.x, this.v3.y, radius);
        grd3.addColorStop(0, v3RGB);
        grd3.addColorStop(1, oldRGB);

        context.beginPath();
        context.moveTo(this.v1.x, this.v1.y);
        context.lineTo(this.v2.x, this.v2.y);
        context.lineTo(this.v3.x, this.v3.y);
        context.closePath();
        context.fill()

        context.globalCompositeOperation = "lighter";

        context.fillStyle = grd1;
        context.fill();

        context.fillStyle = grd2;
        context.fill();

        context.fillStyle = grd3;
        context.fill();

        context.globalCompositeOperation = "source-over";
    }

    stroke(context, color=this.color){

        context.strokeStyle = color
        context.beginPath();
        context.moveTo(this.v1.x, this.v1.y);
        context.lineTo(this.v2.x, this.v2.y);
        context.lineTo(this.v3.x, this.v3.y);
        context.closePath();
        context.stroke()
    }

    fill(context, color=this.color){

        context.fillStyle = Color.rgb([...color])
        context.strokeStyle = Color.rgb([...color])
        context.beginPath();
        context.moveTo(this.v1.x, this.v1.y);
        context.lineTo(this.v2.x, this.v2.y);
        context.lineTo(this.v3.x, this.v3.y);
        context.fill()
        context.stroke()
    }
}

class Mesh{
    constructor(triangles){
        this.triangles = triangles
        this.verticesTriangles = this.initVerticesTriangles()
    }

    static cube(){

        let mesh = new Mesh([
            // SOUTH
            new Triangle(new Vec3d(0, 0, 0), new Vec3d(0, 1, 0), new Vec3d(1, 1, 0)),
            new Triangle(new Vec3d(0, 0, 0), new Vec3d(1, 1, 0), new Vec3d(1, 0, 0)),

            // EAST
            new Triangle(new Vec3d(1, 0, 0), new Vec3d(1, 1, 0), new Vec3d(1, 1, 1)),
            new Triangle(new Vec3d(1, 0, 0), new Vec3d(1, 1, 1), new Vec3d(1, 0, 1)),

            // NORTH
            new Triangle(new Vec3d(1, 0, 1), new Vec3d(1, 1, 1), new Vec3d(0, 1, 1)),
            new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 1, 1), new Vec3d(0, 0, 1)),

            // WEST
            new Triangle(new Vec3d(0, 0, 1), new Vec3d(0, 1, 1), new Vec3d(0, 1, 0)),
            new Triangle(new Vec3d(0, 0, 1), new Vec3d(0, 1, 0), new Vec3d(0, 0, 0)),

            // TOP
            new Triangle(new Vec3d(0, 1, 0), new Vec3d(0, 1, 1), new Vec3d(1, 1, 1)),
            new Triangle(new Vec3d(0, 1, 0), new Vec3d(1, 1, 1), new Vec3d(1, 1, 0)),

            // BOTTOM
            new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 0, 1), new Vec3d(0, 0, 0)),
            new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 0, 0), new Vec3d(1, 0, 0)),
        ])

        return mesh
    }

    initVerticesTriangles(){

        const verticesTriangles = new Map()

        for (let i=0; i < this.triangles.length; i++){

            const triangle = this.triangles[i]

            const v1Id = Mesh.getVertexId(triangle.v1)
            const v2Id = Mesh.getVertexId(triangle.v2)
            const v3Id = Mesh.getVertexId(triangle.v3)

            if(verticesTriangles.has(v1Id)){
                let triangles = verticesTriangles.get(v1Id).triangles
                triangles.push(i)
                verticesTriangles.set(v1Id, {v: triangle.v1, triangles: triangles}) 
            }
            else{
                verticesTriangles.set(v1Id, {v: triangle.v1, triangles: [i]}) 
            }

            if(verticesTriangles.has(v2Id)){
                let triangles = verticesTriangles.get(v2Id).triangles
                triangles.push(i)
                verticesTriangles.set(v2Id, {v: triangle.v1, triangles: triangles}) 
            }
            else{
                verticesTriangles.set(v2Id, {v: triangle.v1, triangles: [i]}) 
            }

            if(verticesTriangles.has(v3Id)){
                let triangles = verticesTriangles.get(v3Id).triangles
                triangles.push(i)
                verticesTriangles.set(v3Id, {v: triangle.v1, triangles: triangles}) 
            }
            else{
                verticesTriangles.set(v3Id, {v: triangle.v1, triangles: [i]})
            }
        }

        return verticesTriangles
    }

    static getVertexId(v){

        return v.x + ':' + v.y + ':' + v.z
    }

    static loadFromVar(fileContent){

        let lines = fileContent.split('\n')

        let vertices = []
        let triangles = []

        lines.forEach(line => {

            const words = line.trim().split(/\s+/)

            if(words[0] == 'v'){

                const x = parseFloat(words[1])
                const y = parseFloat(words[2])
                const z = parseFloat(words[3])

                vertices.push(new Vec3d(x, y, z))
            }
            else if(words[0] == 'f'){

                const v1Index = parseInt(words[1]) - 1
                const v2Index = parseInt(words[2]) - 1
                const v3Index = parseInt(words[3]) - 1

                const v1 = vertices[v1Index]
                const v2 = vertices[v2Index]
                const v3 = vertices[v3Index]

                triangles.push(new Triangle(v1, v2, v3))
            }
        })

        let mesh = new Mesh(triangles)

        return mesh
    }

    draw(context){

    }
}

class Matrix{

    constructor(rows, cols){

        this.m = []
        this.rows = rows
        this.cols = cols

        for (let i=0; i < rows; i++){

            this.m.push([])

            for (let j=0; j < cols; j++){

                this.m[i].push(0)
            }
        }
    }

    static multiplyMatrixes(m1, m2){

        let m = new Matrix(m1.rows, m2.cols)

        for (let i=0; i < m1.rows; i++){

            for (let j=0; j < m2.cols; j++){

                let sum = 0

                for (let k=0; k < m1.cols; k++){

                    sum += m1.m[i][k] * m2.m[k][j] 
                }

                m.m[i][j] = sum
            }
        }

        return m
    }

    static getIdentityMatrix(size){

        let matrix = new Matrix(size, size)

        for (let i=0; i < size; i++){

            matrix.m[i][i] = 1
        }

        return matrix
    }

    print(){

        console.table(this.m)
    }
}

class Projection3d{

    constructor(windowWidth, windowHeight){

        this.projectionMatrix = this.initProjectionMatrix(windowWidth, windowHeight)
    }

    initProjectionMatrix(windowWidth, windowHeight){

        const m = new Matrix(4, 4)

        const fNear = 0.1
        const fFar = 1000
        const fFov = 90
        const fAspectRatio = windowHeight / windowWidth
        const fFovRad = 1 / Math.tan(fFov * 0.5 / 180 * Math.PI)

        m.m[0][0] = fAspectRatio * fFovRad
        m.m[1][1] = fFovRad
        m.m[2][2] = fFar / (fFar - fNear)
        m.m[3][2] = (-fFar * fNear) / (fFar - fNear)
        m.m[2][3] = 1
        m.m[3][3] = 0

        if(this.projectionMatrix != null){
            this.projectionMatrix = m
        }

        return m
    }

    projectVector3d(vec){

        const gotVec = Transformations.transformVec(vec, this.projectionMatrix)

        let w = gotVec.w

        if(gotVec.w != 0){

            gotVec.x /= w
            gotVec.y /= w
            gotVec.z /= w
        }

        return gotVec
    }

    static initPointAt(pos, target, up){

        let forwardVec = Vec3d.sub(target, pos)
        forwardVec = Vec3d.normalize(forwardVec)

        let upAndForwardDotProduct = Vec3d.dotProduct(up, forwardVec)
        let newUp = Vec3d.mul(forwardVec, upAndForwardDotProduct)
        newUp = Vec3d.sub(up, newUp)
        newUp = Vec3d.normalize(newUp)

        const rightVec = Vec3d.crossProduct(newUp, forwardVec)

        let pointAtMatrix = new Matrix(4, 4)

        pointAtMatrix.m[0][0] = rightVec.x
        pointAtMatrix.m[0][1] = rightVec.y
        pointAtMatrix.m[0][2] = rightVec.z

        pointAtMatrix.m[1][0] = newUp.x
        pointAtMatrix.m[1][1] = newUp.y
        pointAtMatrix.m[1][2] = newUp.z

        pointAtMatrix.m[2][0] = forwardVec.x
        pointAtMatrix.m[2][1] = forwardVec.y
        pointAtMatrix.m[2][2] = forwardVec.z

        pointAtMatrix.m[3][0] = pos.x
        pointAtMatrix.m[3][1] = pos.y
        pointAtMatrix.m[3][2] = pos.z
        pointAtMatrix.m[3][3] = 1

        return pointAtMatrix
    }

    static initLookAt(pointAt){

        let lookAtMatrix = new Matrix(4, 4)

        lookAtMatrix.m[0][0] = pointAt.m[0][0]
        lookAtMatrix.m[0][1] = pointAt.m[1][0]
        lookAtMatrix.m[0][2] = pointAt.m[2][0]

        lookAtMatrix.m[1][0] = pointAt.m[0][1]
        lookAtMatrix.m[1][1] = pointAt.m[1][1]
        lookAtMatrix.m[1][2] = pointAt.m[2][1]

        lookAtMatrix.m[2][0] = pointAt.m[0][2]
        lookAtMatrix.m[2][1] = pointAt.m[1][2]
        lookAtMatrix.m[2][2] = pointAt.m[2][2]

        lookAtMatrix.m[3][0] = -(pointAt.m[3][0] * lookAtMatrix.m[0][0] + pointAt.m[3][1] * lookAtMatrix.m[1][0] + pointAt.m[3][2] * lookAtMatrix.m[2][0])
        lookAtMatrix.m[3][1] = -(pointAt.m[3][0] * lookAtMatrix.m[0][1] + pointAt.m[3][1] * lookAtMatrix.m[1][1] + pointAt.m[3][2] * lookAtMatrix.m[2][1])
        lookAtMatrix.m[3][2] = -(pointAt.m[3][0] * lookAtMatrix.m[0][2] + pointAt.m[3][1] * lookAtMatrix.m[1][2] + pointAt.m[3][2] * lookAtMatrix.m[2][2])
        lookAtMatrix.m[3][3] = 1

        return lookAtMatrix
    }

    print(){

        this.projectionMatrix.print()
    }
}

class Transformations{

    static transformVec(vec, m){

        if(m.rows != 4 || m.cols != 4){
            throw Error('Number of cols and rows of matrix must equals 4')
        }

        let values = []

        for (let j=0; j < 4; j++){

            let sum = 0

            sum += vec.x * m.m[0][j]
            sum += vec.y * m.m[1][j]
            sum += vec.z * m.m[2][j]
            sum += m.m[3][j]

            values.push(sum)
        }

        return new Vec3d(values[0], values[1], values[2], values[3])
    }

    static initTranslation(x, y, z){

        const m = new Matrix(4, 4)
        m.m[0][0] = 1
        m.m[1][1] = 1
        m.m[2][2] = 1
        m.m[3][3] = 1
        m.m[3][0] = x
        m.m[3][1] = y
        m.m[3][2] = z

        return m
    }

    static initRotateX(angle){

        const radian = Math.PI * angle / 180
        const sin = Math.sin(radian)
        const cos = Math.cos(radian)

        const transformationM = new Matrix(4, 4)
        transformationM.m[0][0] = 1
        transformationM.m[1][1] = cos
        transformationM.m[2][1] = -sin
        transformationM.m[1][2] = sin
        transformationM.m[2][2] = cos
        transformationM.m[3][3] = 1
        
        return transformationM 
    }

    static initRotateY(angle){

        const radian = Math.PI * angle / 180
        const sin = Math.sin(radian)
        const cos = Math.cos(radian)

        const transformationM = new Matrix(4, 4)
        transformationM.m[0][0] = cos
        transformationM.m[0][2] = -sin
        transformationM.m[1][1] = 1
        transformationM.m[2][0] = sin
        transformationM.m[2][2] = cos
        transformationM.m[3][3] = 1
        
        return transformationM
    }

    static initRotateZ(angle){

        const radian = Math.PI * angle / 180
        const sin = Math.sin(radian)
        const cos = Math.cos(radian)

        const transformationM = new Matrix(4, 4)
        transformationM.m[0][0] = cos
        transformationM.m[0][1] = sin
        transformationM.m[1][0] = -sin
        transformationM.m[1][1] = cos
        transformationM.m[2][2] = 1
        transformationM.m[3][3] = 1
        
        return transformationM
    }

    static rotateX(vec, angle){

        let transformationM = Transformations.initRotateX(angle)

        console.log(transformationM)

        return this.transformVec(vec, transformationM)
    }

    static rotateY(vec, angle){

        let transformationM = Transformations.initRotateY(angle)

        return this.transformVec(vec, transformationM)
    }

    static rotateZ(vec, angle){

        let transformationM = Transformations.initRotateZ(angle)

        return this.transformVec(vec, transformationM)
    }
}

var pixelId = context.createImageData(1,1);
var pixelColor = pixelId.data; // rgba array
pixelColor[0] = 0;
pixelColor[1] = 255;
pixelColor[2] = 0;
pixelColor[3] = 1;            

function drawPixel(context, x, y) {
	//context.fillRect(x, y, 1, 1);
	context.putImageData(pixelId, x, y );  
}

function drawLine(context, x1, y1, x2, y2) {

	let dx, dy, xi, yi;
	let x = x1
	let y = y1

	if(x1 < x2){
	
		xi = 1
		dx = x2 - x1
	}
	else{

		xi = -1
		dx = x1 - x2
	}

	if(y1 < y2){

		yi = 1
		dy = y2 - y1
	}
	else{

		yi = -1
		dy = y1 - y2
	}

	if(dy > dx){

		let ai = 2*(dy - dx)
		let bi = dy * 2
		let d = bi - dx

		while(x != x2){

			if(d >= 0){

				x += xi
				y += yi
				d += ai
			}
			else{

				y += yi
				d += bi
			}

			drawPixel(context, x, y)
		}
	}
	else{

		let ai = 2*(dx - dy)
		let bi = dx * 2
		let d = bi - dy

		while(y != y2){

			if(d >= 0){

				x += xi
				y += yi
				d += ai
			}
			else{

				y += yi
				d += bi
			}

			drawPixel(context, x, y)
		}
	}
}