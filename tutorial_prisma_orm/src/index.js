import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function insertar() {
    const newUser = await prisma.user.create({
        data: {
            name: "Martha3",
            email: "martha3@gmail.com"
        }
    })

    console.log(newUser);
}

async function listar() {
    const users = await prisma.user.findMany();
    console.log(users)

    users.map(user => {
        console.log(`${user.id} - ${user.name}`)
    })
}

async function buscar() {
    const user = await prisma.user.findFirst({
        // where: {id: 1,name: "Juan"} //1 o más parametros
        where: {
            OR: [
                { id: 1 },
                { email: "maria@gmail.com" }
            ]
        }
    });

    console.log(user)
}

async function eliminar() {
    /*
    try {
        const user = await prisma.user.delete({
            where: {
                id: 4
            }
        });

        if (user) {
            console.log(user)
        }
    } catch (e) {
        console.error(e)
    }
        */
    const user = await prisma.user.delete({
        where: {
            id: 3
        }
    }).catch((e)=>{
        console.log(e);
        return null; // Opcional: maneja el caso de error devolviendo un valor predeterminado.
    })

    if (user) {
        console.log(user);
    }
}

async function update() {
    const user = await prisma.user.update({ //updateMany actualiza multiples filas a partir de una busqueda
        where: {
            id: 4
        },
        data: {
            lastname: "huaman",
            email: "juan1@gmail.com"
        }
     });
    
    console.log(user);
}

async function actualizarMuchos() {
    const result = await prisma.user.updateMany({
        where:{
            name: 'Martha'
        },
        data: {
            lastname: 'Lorens'
        }
    })

    console.log("Registros afectados: "+result.count);
}

async function eliminarMuchos() {
        const result = await prisma.user.deleteMany({
            where: {
                name: "Martha"
            }
        });

        console.log(result)
}

async function upsert(params) {
    /*
    El metodo upsert busca un registro en base a la condicion,
    si no existe, crea el registro
    si existe, actualiza el registro encontrado
    */
    const user = await prisma.user.upsert({
        where:  {
            email: 'juan1@gmail.com'
        },
        create: {
            name: 'Juan',
            email: 'juan1@gmail.com',
            lastname: 'Huaman Chavez'
        },
        update: {
            lastname: 'Huaman Chavez'
        }
    })

    console.log(user);
}

async function insertUserAndPost(params) {
    const newUser = await prisma.user.create({
        data: {
            name: "Luis",
            email: "luis@gmail.com"
        }
    })

    console.log(newUser);

    const newPost = await prisma.post.create({
        data: {
            title: 'Mi primer post',
            content: 'Hola mundooooooooooooo',
            //userId: newUser.id // Primera forma
            user: { //Segunda forma (se puede acceder a más propiedades)
                connect: {
                    id: newUser.id
                }
            }
        }
    });

    console.log(newPost);
}

//tercera_forma
async function insertUserAndPost_terceraForma(params) {
    const newUserAndPost = await prisma.user.create({
        data: {
            name: "Daniel",
            email: "daniel@gmail.com",
            posts: {
                create: {
                    title: "Hola, soy Daniel",
                    content: "Hola, mi nombre es Daniel, soy nueo"
                }
            }
        }
    })
    console.log(newUserAndPost);
    
    const posts = await prisma.post.findMany()
    console.log(posts)
}

async function listUsersandPost() {
    const users = await prisma.user.findMany({
        include: {
            posts: true
        }
    })

    users.forEach(user => {
        console.log('=========');
        console.log(`User: ${user.name}`);
        console.log(`Email: ${user.email}`);

        user.posts.forEach((post, i)=>{
            console.log(`${i+1}. ${post.title} ${post.content}`)
        })
    })
}


eliminar()