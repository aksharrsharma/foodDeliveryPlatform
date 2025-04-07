require('dotenv').config();

const { newOrder } = require('../controllers/orderController');
const Order = require('../models/order');
const Item = require('../models/item');


jest.mock('../models/order');
jest.mock('../models/item');

describe('Order Controller - add to cart', () => {
  test('add to cart', async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    Item.findById.mockResolvedValue({
      _id: '123',
      name: 'Test Item',
      price: 20,
    });

    const mockOrder = {
      customerId: 'user123',
      items: [],
      totalPrice: 0,
      save: saveMock,
    };

    Order.findOne.mockResolvedValue(mockOrder);

    const req = {
      params: { id: '123' },
      session: {
        user: 'user123',
        save: (cb) => cb(),
      },
      flash: jest.fn(),
    };

    const res = {
      redirect: jest.fn(),
      flash: jest.fn(),
    };

    await newOrder(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/profile/mycart');
  });
});
