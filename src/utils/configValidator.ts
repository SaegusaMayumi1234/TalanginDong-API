export default () => {
  // env PORT Validator
  if (!process.env.PORT) {
    throw new Error('Missing env PORT! (Allowed value: integer 1024-65535)');
  } else {
    const port = parseInt(process.env.PORT);
    if (Number.isNaN(port)) {
      throw new Error('env PORT value is NaN! (Allowed value: integer 1024-65535)');
    } else if (!Number.isInteger(port)) {
      throw new Error('env PORT value is not integer! (Allowed value: integer 1024-65535)');
    } else if (port < 1024 || port > 65535) {
      throw new Error('env PORT value is not in the port range! (Allowed value: integer 1024-65535)');
    }
  }

  // env PROXIED Validator
  if (!process.env.PROXIED) {
    throw new Error('Missing env PROXIED! (Allowed value: false, integer)');
  } else if (process.env.PROXIED !== 'false') {
    const proxied = parseInt(process.env.PORT);
    if (Number.isNaN(proxied)) {
      throw new Error('env PROXIED value is NaN! (Allowed value: false, integer)');
    } else if (!Number.isInteger(proxied)) {
      throw new Error('env PROXIED value is not integer! (Allowed value: false, integer)');
    }
  }

  // env MONGODBURI Validator
  if (!process.env.MONGODBURI) {
    throw new Error('Missing env MONGODBURI! (Allowed value: string)');
  }

  // env MONGODBNAME Validator
  if (!process.env.MONGODBNAME) {
    throw new Error('Missing env MONGODBNAME! (Allowed value: string)');
  }

  if (!process.env.JWTKEY) {
    throw new Error('Missing env JWTKEY! (Allowed value: string)');
  }
};
