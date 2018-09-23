try {
    if(!process.env.APP_ENVIRONMENT || process.env.APP_ENVIRONMENT === 'local') {
    console.log('testing from config its local');
    require('dotenv').config({path: './config/local.conf'});
    } else if(process.env.APP_ENVIRONMENT === 'prod') {
        console.log('testing from config its prod');
        require('dotenv').config({path: '.././config/prod.conf'});       
    } else {

        console.log('testing from config its else');
        throw new Error('config file read error');
    }
  } catch(e) {
    console.log(e);
    throw new Error('config file read error');
  }
