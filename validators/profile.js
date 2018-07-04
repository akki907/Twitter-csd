const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateprofileInput (data){
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : ''
    data.skills = !isEmpty(data.skills) ? data.skills : ''

    // if(!Validator.isLength(data.handle),{min: 2,max:40}){
    //     errors.name = 'Handle needs to be between 2 and 40 characters.'
    // }

    if(Validator.isEmpty(data.status)){
        errors.name = 'status field is required.'
    }

    if(Validator.isEmpty(data.handle)){
        errors.name = 'Handle field is required.'
    }


    if(Validator.isEmpty(data.skills)){
        errors.name = 'Skills field is required.'
    }

    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.name = 'Not a valid url.'
        }
    }


    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.name = 'Not a valid url.'
        }
    }


    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.name = 'Not a valid url.'
        }
    }


    if(!isEmpty(data.linkdin)){
        if(!Validator.isURL(data.linkdin)){
            errors.name = 'Not a valid url.'
        }
    }


    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.name = 'Not a valid url.'
        }
    }

    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.name = 'Not a valid url.'
        }
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}