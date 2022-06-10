const bcrypt = require('bcryptjs');
const { Car, User, Role } = require('../app/models');
const CarController = require('../app/controllers/CarController');
const AuthenticationController = require('../app/controllers/AuthenticationController');
const ApplicationController = require('../app/controllers/ApplicationController');
const NotFoundError = require('../app/errors/NotFoundError');
const RecordNotFoundError = require('../app/errors/RecordNotFoundError');
const EmailNotRegisteredError = require('../app/errors/EmailNotRegisteredError');

describe('CarController', () => {
  describe('#handleCreateCar', () => {
    it('should call res.status(201) and res.json with car instance', async () => {
      const name = 'Mini Cooper';
      const price = 1200000;
      const size = 'Small';
      const image = 'minicooper.png';

      const mockRequest = {
        body: {
          name, price, size, image,
        },
      };

      const car = new Car({
        name, price, size, image,
      });
      const mockCarModel = { create: jest.fn().mockReturnValue(car) };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const carController = new CarController({ carModel: mockCarModel });

      await carController.handleCreateCar(mockRequest, mockResponse);

      expect(mockCarModel.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(car);
    });

    it('should call res.status(422) and res.json error name and message', async () => {
      const err = new Error('Something');
      const name = 'Mini Cooper';
      const price = 1200000;
      const isCurrentlyRented = false;
      const size = 'Small';
      const image = 'minicooper.png';

      const mockRequest = {
        body: {
          name, price, size, image,
        },
      };
      const mockCarModel = {
        create: jest.fn().mockReturnValue(Promise.reject(err)),
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const carController = new CarController({ carModel: mockCarModel });

      await carController.handleCreateCar(mockRequest, mockResponse);

      expect(mockCarModel.create).toHaveBeenCalledWith({
        name, price, size, image, isCurrentlyRented,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    });
  });

  describe('#handleGetCar', () => {
    it('should call res.status(200) and res.json with car instance', async () => {
      const name = 'Mini Cooper';
      const price = 1200000;
      const size = 'Small';
      const image = 'minicooper.png';

      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCar = new Car({
        name, price, size, image,
      });
      const mockCarModel = {};
      mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleGetCar(mockRequest, mockResponse);

      expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCar);
    });
  });

  describe('#handleUpdateCar', () => {
    it('should call res.status(200) and res.json with car instance', async () => {
      const name = 'Mini Cooper';
      const price = 1200000;
      const isCurrentlyRented = false;
      const size = 'Small';
      const image = 'minicooper.png';

      const mockRequest = {
        params: {
          id: 1,
        },
        body: {
          name,
          price,
          size,
          image,
          isCurrentlyRented,
        },
      };

      const mockCar = new Car({
        name, price, size, image, isCurrentlyRented,
      });
      mockCar.update = jest.fn().mockReturnThis();

      const mockCarModel = {};
      mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleUpdateCar(mockRequest, mockResponse);

      expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCar.update).toHaveBeenCalledWith({
        name, price, size, image, isCurrentlyRented,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCar);
    });
  });

  describe('#handleDeleteCar', () => {
    it('should call res.status(204)', async () => {
      const name = 'Mini Cooper';
      const price = 1200000;
      const isCurrentlyRented = false;
      const size = 'Small';
      const image = 'minicooper.png';

      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCar = new Car({
        name, price, isCurrentlyRented, size, image,
      });
      mockCar.destroy = jest.fn();

      const mockCarModel = {};
      mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar);

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.end = jest.fn().mockReturnThis();

      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleDeleteCar(mockRequest, mockResponse);

      expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockCar.destroy).toHaveBeenCalledWith();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.end).toHaveBeenCalled();
    });

    it('should call res.status(404) and res.json with error instance', async () => {
      const err = new Error('Not found!');

      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCarModel = {};
      mockCarModel.findByPk = jest.fn(() => Promise.reject(err));

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleDeleteCar(mockRequest, mockResponse);

      expect(mockCarModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    });
  });
});

describe('AuthenticationController', () => {
  describe('#handleGetUser', () => {
    // ini untuk yang usernya ada dan rolenya juga ada
    it('should call res.status(200)', async () => {
      const name = 'erlina';
      const email = 'erlina@gmail.com';
      const image = 'erlina-ava.png';
      const password = '123456';
      const encryptedPassword = bcrypt.hashSync(password, 10);
      const roleId = 1;

      const mockRequest = {
        user: {
          id: 1,
        },
      };

      const mockUser = new User({
        name, email, image, encryptedPassword, roleId,
      });
      const mockUserModel = {};
      mockUserModel.findByPk = jest.fn().mockReturnValue(mockUser);

      const mockRole = new Role({ name: 'ADMIN' });
      const mockRoleModel = {};
      mockRoleModel.findByPk = jest.fn().mockReturnValue(mockRole);

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      // eslint-disable-next-line max-len
      const authenticationController = new AuthenticationController({ userModel: mockUserModel, roleModel: mockRoleModel });
      await authenticationController.handleGetUser(mockRequest, mockResponse);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should call res.status(404) and error because user id not found', async () => {
      const name = 'erlina';
      const err = new RecordNotFoundError(name);

      const mockRequest = {
        user: {
          id: 1,
        },
      };

      const mockUserModel = {};
      mockUserModel.findByPk = jest.fn().mockReturnValue('');
      mockUserModel.name = name;

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const authenticationController = new AuthenticationController({ userModel: mockUserModel });
      await authenticationController.handleGetUser(mockRequest, mockResponse);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(err);
    });

    it('should call res.status(404) and error because user not have role', async () => {
      const roleName = 'ADMINISTRATOR';
      const err = new RecordNotFoundError(roleName);
      const name = 'erlina';
      const email = 'erlina@gmail.com';
      const image = 'erlina-ava.png';
      const password = '123456';
      const encryptedPassword = bcrypt.hashSync(password, 10);
      const roleId = 1;

      const mockRequest = {
        user: {
          id: 1,
        },
      };

      const mockUser = new User({
        name, email, image, encryptedPassword, roleId,
      });
      const mockUserModel = {};
      mockUserModel.findByPk = jest.fn().mockReturnValue(mockUser);

      const mockRoleModel = {};
      mockRoleModel.findByPk = jest.fn().mockReturnValue('');
      mockRoleModel.name = roleName;

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      // eslint-disable-next-line max-len
      const authenticationController = new AuthenticationController({ userModel: mockUserModel, roleModel: mockRoleModel });
      await authenticationController.handleGetUser(mockRequest, mockResponse);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(err);
    });
  });

  describe('#handleRegister', () => {
    it('should call res.status(422) and error because email already  taken', async () => {
      const name = 'erlina';
      const email = 'erlina@gmail.com';
      const image = 'erlina-ava.png';
      const password = '123456';
      const encryptedPassword = bcrypt.hashSync(password, 10);
      const err = new Error(`${email} already taken`);
      const roleId = 'ADMIN';

      const mockRequest = {
        body: {
          email,
          password,
        },
      };

      const mockUser = new User({
        name, email, image, encryptedPassword, roleId,
      });
      const mockUserModel = {};
      mockUserModel.findOne = jest.fn().mockReturnValue(mockUser);

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      // eslint-disable-next-line max-len
      const authenticationController = new AuthenticationController({ userModel: mockUserModel });
      await authenticationController.handleRegister(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith(err);
    });
  });
});

describe('ApplicationController', () => {
  describe('#handleGetRoot', () => {
    it('should call res.status(200)', async () => {
      const status = 'OK';
      const message = 'BCR API is up and running!';

      const mockRequest = {
        method: 'get',
      };

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const applicationController = new ApplicationController();
      applicationController.handleGetRoot(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status, message,
      });
    });
  });

  describe('#handleNotFound', () => {
    it('should call res.status(404)', async () => {
      const method = 'get';
      const url = 'http://localhost:8000/err';
      const err = new NotFoundError(method, url);

      const mockRequest = {
        method, url,
      };

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const applicationController = new ApplicationController();
      applicationController.handleNotFound(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details,
        },
      });
    });
  });

  describe('#handleError', () => {
    it('should call res.status(500)', async () => {
      const err = new Error('Something');
      const next = jest.fn();

      const mockRequest = {};

      const mockResponse = {};
      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn().mockReturnThis();

      const applicationController = new ApplicationController();
      applicationController.handleError(err, mockRequest, mockResponse, next);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details || null,
        },
      });
    });
  });
});
