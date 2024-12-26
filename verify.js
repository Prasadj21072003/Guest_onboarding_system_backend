function verify(req, res, next) {
  const email = req.headers.email;
  const pass = req.headers.pass;

  try {
    if (email && pass) {
      if (email === "random@gmail.com") {
        if (pass === "random") {
          var user = {
            email: "random@gmail.com",
            pass: "random",
          };
          req.user = user;
          next();
        }
      }
    }
  } catch (err) {
    console.log(`you are not authenticated ${err}`);
  }
}

module.exports = verify;
