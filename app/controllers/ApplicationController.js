const { NotFoundError } = require('../errors');

class ApplicationController {
  // eslint-disable-next-line class-methods-use-this
  handleGetRoot = (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'BCR API is up and running!',
    });
  };

  // eslint-disable-next-line class-methods-use-this
  handleNotFound = (req, res) => {
    const err = new NotFoundError(req.method, req.url);

    res.status(404).json({
      error: {
        name: err.name,
        message: err.message,
        details: err.details,
      },
    });
  };

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  handleError = (err, req, res, next) => {
    res.status(500).json({
      error: {
        name: err.name,
        message: err.message,
        details: err.details || null,
      },
    });
  };

  // eslint-disable-next-line class-methods-use-this
  getOffsetFromRequest(req) {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    return offset;
  }

  // eslint-disable-next-line class-methods-use-this
  buildPaginationObject(req, count) {
    const { page = 1, pageSize = 10 } = req.query;
    const pageCount = Math.ceil(count / pageSize);
    return {
      page,
      pageCount,
      pageSize,
      count,
    };
  }
}

module.exports = ApplicationController;
