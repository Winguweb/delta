import * as yup from 'yup'


export const createNotifyOrderSchema = yup
  .object({
    telephone: yup.string().required(),
    location: yup.object({
      lat: yup.number().required(),
      lng: yup.number().required()
      }).required(),
});