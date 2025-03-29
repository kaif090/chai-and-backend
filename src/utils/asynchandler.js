const asynchandler = (reqesthandler) => {
  (req, res, next) => {
    Promise.resolve(reqesthandler(res, req, next)).catch((error) => next(err));
  };
};

export default asynchandler;
