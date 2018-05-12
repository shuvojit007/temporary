import { compareSync } from 'bcryptjs';
import { generateJwt } from '@utl';
import { OrderCrud } from './order.model';

let Order;
let VerifyOrder;
let OrderNew;

let isMatched;
let order;

// const { 0: secret } = config.get('secret');
let token;


const OrderSingle = async (ctx) => {
  try {
    Order = await OrderCrud.single({
      qr: { _id: ctx.params.id }
    });
  } catch (e) {
    ctx.throw(404, e.message);
  } finally {
    ctx.body = {
      Order
    };
  }
};



const OrderCreate = async (ctx) => {
  // console.log(ctx.request.body);
  const orderData = Object.assign({
    author: ctx.state.user.uid
  }, ctx.request.body);
  try {
    OrderNew = await OrderCrud.create(orderData);
  } catch (e) {
    ctx.throw(422, e.message);
  }  finally {
    try {
      user = await userCrud.single({
        qr: { _id: ctx.state.user.uid }
      });
    } catch (e) {
      ctx.throw(422, e.message);
    } finally {
      user.order.push(OrderNew._id);
      user.save();
      ctx.body = {
        body: OrderNew,
        message: 'SuccesFully Add new Order'
      };
    }
  }
};


const OrderUpdate = async (ctx) => {
  try {
    user = await userCrud.single({
      qr: { _id: ctx.state.user.uid }
    });
    isMatched = user.order.indexOf(ctx.params.id);
  } catch (e) {
    ctx.throw(422, e.message);
  } finally {
    if (isMatched !== -1) {
      try {
        order = await OrderCrud.put({
          params: {
            qr: { _id: ctx.params.id }
          },
          body: ctx.request.body
        });
      } catch (e) {
        ctx.throw(422, e.message);
      } finally {
        ctx.body = {
          body: order,
          message: 'Post Updated..'
        };
      }
    } else {
      ctx.body = {
        message: 'Sorry you don\'t have right to edit this'
      };
    }
  }
};

const OrderDelete = async (ctx) => {
  try {
    user = await userCrud.single({
      qr: { _id: ctx.state.user.uid }
    });
    isMatched = user.order.indexOf(ctx.params.id);
  } catch (e) {
    ctx.throw(422, e.message);
  } finally {
    if (isMatched !== -1) {
      try {
        order = await OrderCrud.delete({
          params: {
            qr: { _id: ctx.params.id }
          }
        });
      } catch (e) {
        ctx.throw(422, e.message);
      } finally {
        ctx.body = {
          body: order,
          message: 'Deleted'
        };
      }
    } else {
      ctx.body = {
        message: 'Sorry you don\'t have right to delete this'
      };
    }
  }
};

const OrderAll = async (ctx) => {
  try {
    order = await OrderCrud.get();
  } catch (e) {
    ctx.throw(404, e.message);
  } finally {
    ctx.body = order;
  }
};




export {
  OrderSingle,
  OrderCreate,
  OrderUpdate,
  OrderDelete,
  OrderAll
};
