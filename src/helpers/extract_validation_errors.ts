import { ValidationError } from 'class-validator';


export const extractValidationErrors = (errors: ValidationError[]): string => {
    return errors
        .map(error => {
            return Object.values(error.constraints).join(', ');
        })
        .join('. ');
};
