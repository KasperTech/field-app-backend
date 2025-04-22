
const prod = ["https://remarkable-griffin-2158bf.netlify.app"]
const dev = ["http://localhost:5173"]
const staging=["https://remarkable-griffin-2158bf.netlify.app"]


function allowedOrigins() {
    switch (process.env.NODE_ENV) {
      case 'production':
        return prod;
      case 'staging':
        return staging;
      case 'development':
      default:
        return dev;
    }
  }
  
  module.exports = allowedOrigins();