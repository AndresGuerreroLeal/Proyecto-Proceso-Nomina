import { useFormik } from "formik";
import { LoginSchema } from "./validadorSchemas";

const formikMain = (handleSubmit, values) => {
  const formik = useFormik({
    initialValues: values,
    validationSchema: LoginSchema,
    onSubmit: async (valores, { resetForm }) => {
      await handleSubmit(valores);
      resetForm();
    },
  });

  return formik;
};

export default formikMain;
