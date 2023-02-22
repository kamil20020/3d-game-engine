class Game{

    constructor(){

        this.gameEnded = false
        this.width = context.canvas.width
        this.height = context.canvas.height
        this.projectionMatrix = new Projection3d(this.width, this.height)
        this.mesh = null
        this.camera = new Vec3d()
        this.lookDir = new Vec3d()
        this.theta = 0
		this.fYaw = 0

        this.setupWindowProps()
        this.initComponents()
        this.events()
    }

    setupWindowProps(){
        const requestAnimationFrame = window.requestAnimationFrame || 
                                      window.mozRequestAnimationFrame || 
                                      window.webkitRequestAnimationFrame ||
                                      window.msRequestAnimationFrame;
    
        window.requestAnimationFrame = requestAnimationFrame;
    }
    
    initComponents = () => {

        this.mesh = Mesh.loadFromVar(mountains) // Mesh.cube() //Mesh.loadFromVar(axis)
    }

    getElapsedTime(){

        const endTime = new Date().getTime()

        return endTime - this.startTime
    }

    drawComponents = () => {

        //this.theta += 1
        //this.theta = this.theta % 360

        const matrixRotZ = Transformations.initRotateZ(180) //180 //this.theta * 0.5
        const matrixRotX = Transformations.initRotateX(this.theta)

        //Offset to z
        const matrixTranslate = Transformations.initTranslation(-8, 8, 10) //(-8, 80, 100) //(-8, 8, 10) //(0, 0, 4)

        let matrixGlobal = Matrix.getIdentityMatrix(4)
        matrixGlobal = Matrix.multiplyMatrixes(matrixRotZ, matrixRotX)
        matrixGlobal = Matrix.multiplyMatrixes(matrixGlobal, matrixRotX)
        matrixGlobal = Matrix.multiplyMatrixes(matrixGlobal, matrixTranslate)

        this.lookDir = new Vec3d(0, 0, 1)
        const upVec = new Vec3d(0, 1, 0)
        let targetVec = new Vec3d(0, 0, 1)
		const cameraRotMatrix = Transformations.initRotateY(this.fYaw)
		this.lookDir = Transformations.transformVec(targetVec, cameraRotMatrix)
		targetVec = Vec3d.add(this.camera, this.lookDir)

        const cameraMatrix = Projection3d.initPointAt(this.camera, targetVec, upVec)
        const viewMatrix = Projection3d.initLookAt(cameraMatrix)

        let normals = []
        let toDrawTriangles = []

        for (let i=0; i < this.mesh.triangles.length; i++){

            const triangle = this.mesh.triangles[i]

            let v1 = new Vec3d(triangle.v1.x, triangle.v1.y, triangle.v1.z)
            let v2 = new Vec3d(triangle.v2.x, triangle.v2.y, triangle.v2.z)
            let v3 = new Vec3d(triangle.v3.x, triangle.v3.y, triangle.v3.z)

            v1 = Transformations.transformVec(v1, matrixGlobal)
            v2 = Transformations.transformVec(v2, matrixGlobal)
            v3 = Transformations.transformVec(v3, matrixGlobal)

            let line1 = Vec3d.sub(v2, v1)
            let line2 = Vec3d.sub(v3, v1)
            let normal = Vec3d.crossProduct(line1, line2)
            normal = Vec3d.normalize(normal)

            normals.push(normal)

            const cameraRay = Vec3d.sub(v1, this.camera)
            
            if(Vec3d.dotProduct(normal, cameraRay) < 0){

                let light = new Vec3d(0, 0, -1)
                light = Vec3d.normalize(light)

                let dotProductWithLight = Vec3d.dotProduct(normal, light)

                let r = 0
                let g = 180 //180
                let b = 0

                r *= dotProductWithLight
                g *= dotProductWithLight
                b *= dotProductWithLight

                v1 = Transformations.transformVec(v1, viewMatrix)
                v2 = Transformations.transformVec(v2, viewMatrix)
                v3 = Transformations.transformVec(v3, viewMatrix)

                //Project 2D -> 3D
                v1 = this.projectionMatrix.projectVector3d(v1)
                v2 = this.projectionMatrix.projectVector3d(v2)
                v3 = this.projectionMatrix.projectVector3d(v3)

                //Scale into view
                v1.x = (v1.x + 1) * this.width / 2
                v1.y = (v1.y + 1) * this.height / 2

                v2.x = (v2.x + 1) * this.width / 2
                v2.y = (v2.y + 1) * this.height / 2

                v3.x = (v3.x + 1) * this.width / 2
                v3.y = (v3.y + 1) * this.height / 2

                const projectedTriangle = new Triangle(v1, v2, v3)
                projectedTriangle.color = [r, g, b]

                toDrawTriangles.push(projectedTriangle)
            }
        }

        toDrawTriangles.sort((t1, t2) => {

            const z1 = (t1.v1.z + t1.v2.z + t1.v3.z) / 3
            const z2 = (t2.v1.z + t2.v2.z + t2.v3.z) / 3

            return z2 - z1

        })

        /*for (const [vId, value] of this.mesh.verticesTriangles){

            const vertex = value.v
            const triangles = value.triangles

            let nX = 0
            let nY = 0
            let nZ = 0
            
            for(let i=0; i < triangles.length; i++){

                const normalIndex = triangles[i]

                nX += normals[normalIndex].x
                nY += normals[normalIndex].y
                nZ += normals[normalIndex].z
            }

            nX /= normals.length
            nY /= normals.length
            nZ /= normals.length

            vertex.normal = new Vec3d(nX, nY, nZ)
        }

        console.log(this.mesh.verticesTriangles)*/

        for (let i=0; i < toDrawTriangles.length; i++){

            const triangle = toDrawTriangles[i]

            //triangle.fillGradient(context)
            triangle.fill(context)
            //triangle.stroke(context, 'black')
        }
    }

    draw = () => {

        context.clearRect(0, 0, this.width, this.height)
        context.fillStyle = "white";
        context.fillRect(0, 0, this.width, this.height);

        this.drawComponents()
    }

    events = () => {

        window.addEventListener("keydown", (e) => {

            let forward = Vec3d.mul(this.lookDir, 8)
            console.log(this.camera, forward)

            switch (e.key) {
              
                case "ArrowUp":
                    this.camera.y -= 8
                    break
                
                case "ArrowDown":
                    this.camera.y += 8
                    break

                
                case "ArrowLeft":
                    this.camera.x -= 8
                    break
                
                case "ArrowRight":
                    this.camera.x += 8
                    break

				case "a":
					this.fYaw -= 2
					break

				case "d":
					this.fYaw += 2
					break

				case "w":
					this.camera = Vec3d.add(this.camera, forward)
					break

				case "s":
					this.camera = Vec3d.sub(this.camera, forward)
					break
            }
        });
    }

    gameLoop = () => {

        this.draw()

        window.requestAnimationFrame(this.gameLoop)
    }

    run(){
        window.requestAnimationFrame(this.gameLoop);
    }
}