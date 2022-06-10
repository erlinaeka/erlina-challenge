const ApplicationError = require('./ApplicationError');

class CarAlreadyRentedError extends ApplicationError {
  constructor(car) {
    super(`${car.name} is already rented!!`);
  }

  // eslint-disable-next-line class-methods-use-this
  get details() {
    // eslint-disable-next-line no-undef
    return { car };
  }
}

module.exports = CarAlreadyRentedError;
