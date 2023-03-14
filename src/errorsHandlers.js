export const badReqHandler = (error, req, res, next) => {
  if (error.status === 400) {
    res.status(400).send({
      message: error.message,
    });
  } else {
    next(error);
  }
};

export const notFoundHandler = (error, req, res, next) => {
  if (error.status === 404) {
    res.status(404).send({ message: error.message });
  } else {
    next(error);
  }
};

export const generalErrorHandler = (error, req, res, next) => {
  console.log("ERROR:", error);
  res.status(500).send({
    message: "Something went wrong on the server side! Please try again later",
  });
};
