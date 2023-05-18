import fs from 'fs'


export class ProductManager {

    #error

    #path
    #format
    #currentProducts
    #productsActualization

    constructor(path){
        this.#path = path
        this.#format = 'utf-8'

        this.#error = null

        this.#currentProducts = []
        this.#productsActualization = []
    }

    #idGenerator = (length) => (length === 0) ? 1 : length + 1


    getProducts = async () => {
        let fileExist = fs.existsSync(this.#path)

        if(!fileExist){
            this.#error = 'No existe el archivo de productos'
            return `Error: ${this.#error}`
        } else {
            return JSON.parse( await fs.promises.readFile(this.#path, this.#format))
        }
    }

    addProduct = async ({category, title, brand, thumbnail, price, stock}) => {
        let fileExist = fs.existsSync(this.#path)

        if(!fileExist){
            await fs.promises.writeFile(this.#path, JSON.stringify([]))
        }

        let currentProducts = await this.getProducts()

        let id = this.#idGenerator(currentProducts.length)

        
        this.#productsActualization.push(
            ...currentProducts,
            {
                id: id, 
                code: `${1000 + id}`, 
                category, 
                title, 
                brand,
                thumbnail, 
                price, 
                stock
            }
        )

        return await fs.promises.writeFile(this.#path, JSON.stringify(this.#productsActualization, null, '\t'))
    }

    getProductsById = async (id) => {
        let currentProducts = await this.getProducts()

        let find = currentProducts.find(el => el.id === id)

        if(find){
            return find
        } else {
            this.#error = 'ID no encontrado'
            return `Error: ${this.#error}`
        }
    }

    updateProduct = async (id, campo, contenido) => {
        let currentProducts = await this.getProducts()

        let updatingItem = currentProducts.find(item => item.id === id)
        let updated = {...updatingItem, [campo]: contenido}

        let newArray = [
            updated,
            ...currentProducts.filter(el => el.id !== id)
        ]
        
        return await fs.promises.writeFile(this.#path, JSON.stringify(newArray, null, '\t'))
    }

    deleteProduct = async (id) => {
        let currentProducts = await this.getProducts()

        let newArray = [...currentProducts.filter(el => el.id !== id)]

        return await fs.promises.writeFile(this.#path, JSON.stringify(newArray, null, '\t'))
    }
}


const Products = new ProductManager('./Products.json')

// Products.getProducts() .then(res => console.log(res))

// Products.getProductsById(3).then(res => console.log(res))

// Products.addProduct({ 
//     category: "Cocina", 
//     title: "Set de cubiertos dorados", 
//     brand: "Eleonore", 
//     thumbnail: "https://falabella.scene7.com/is/image/FalabellaPE/770536585_1?wid=800&hei=800&qlt=70",
//     price: 180000, 
//     stock: 20
// })

// Products.updateProduct(1, "brand", "Still")

// Products.deleteProduct(5)