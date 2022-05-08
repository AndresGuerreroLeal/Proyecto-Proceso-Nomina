import { useFormik } from "formik";
import validador from "./validadorSchemas";

const formikMain = (handleSubmit, values, schema) => {
  const formik = useFormik({
    initialValues: values,
    validationSchema: validador[schema],
    onSubmit: (valores, { resetForm }) => {
      handleSubmit(valores);
      console.log(valores)
      console.log(valores.file)
      resetForm();
    },  
  });

  return formik;
};

export default formikMain;
