import type {AfterChangeHook} from 'payload/dist/collections/config/types'

import type {Order, Product} from '../../../payload-types'

// Custom type guard function
function isProduct(product: string | Product): product is Product {
  return typeof product === 'object' && product !== null;
}

export const updateUserPurchases: AfterChangeHook<Order> = async ({doc, req, operation}) => {
  const {payload} = req

  if ((operation === 'create' || operation === 'update') && doc.orderedBy && doc.items) {
    const orderedBy = typeof doc.orderedBy === 'string' ? doc.orderedBy : doc.orderedBy.id

    const user = await payload.findByID({
      collection: 'users',
      id: orderedBy,
    })

    if (user) {
      await payload.update({
        collection: 'users',
        id: orderedBy,
        data: {
          purchases: [
            ...(user?.purchases?.map(purchase =>
              typeof purchase === 'string' ? purchase : purchase.id,
            ) || []), // eslint-disable-line function-paren-newline
            ...(doc?.items?.map(({product}) => {
              return product.id
              }
            ) || []), // eslint-disable-line function-paren-newline
          ],
        },
      })
      doc?.items?.map(async (order) => {
        console.log(order.product.quantity)
        if (order.product.quantity && order.quantity) {
          await payload.update({
            collection: 'products',
            id: order.product.id,
            data: {
              quantity: order.product.quantity - order.quantity
            }
          });
        }
      })
    }
  }
  return
}
