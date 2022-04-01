const allowlist = ['*', 'http://localhost:8080', 'http://localhost:3000'];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

  if (isDomainAllowed ) {
      // Enable CORS for this request
      corsOptions = { origin: true, optionsSuccessStatus: 200 };
  } else {
      // Disable CORS for this request
      corsOptions = { origin: false };
  }
  callback(null, corsOptions);
}

module.exports = corsOptionsDelegate;