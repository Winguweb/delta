import * as yup from 'yup';

export const uuidSchema = yup.string().uuid().required();
