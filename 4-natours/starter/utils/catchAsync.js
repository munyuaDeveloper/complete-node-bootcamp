module.exports = fn => {
  return (req, res, next) => {
    console.log('674665656565645646', res);
    fn(req, res, next).catch(next);
  };
};
