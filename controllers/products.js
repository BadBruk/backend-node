import fetch from "node-fetch"

export const getProducts = async (req, res) => {
    const products = await fetch('https://dummyjson.com/products', {
        method: 'GET',
    })
    res.send(products)
}