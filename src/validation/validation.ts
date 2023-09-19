import * as yup from "yup";
// here schema are defined for login , register and task add and edit task
export const  validation ={
  schemaforLogin:yup.object().shape({
    email: yup.string().email().required(), 
    password: yup.string().min(6).max(100).required(),
  }),
  schemaforRegister:yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(100).required(),
    name:yup.string().required(),
  }),
  schemaforAddTaskandEditTask:yup.object().shape({
    id:yup.string().required(),
    title:yup.string().required(),
    description:yup.string().required(),
    duedate:yup.string().required(),
    priority:yup.string().required()
    })

}
